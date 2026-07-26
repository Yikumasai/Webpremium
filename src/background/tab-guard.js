// 在标签页层面拦下重复打开：新标签页刚创建时，如果它要去的网址在同一窗口里已经
// 打开过，就激活那个已有标签页并把新标签页关掉（关闭会取消尚未提交的导航请求）。
//
// 为什么要在这一层拦：content script 的 click 拦截只能覆盖"页面里的 <a> 被普通左键
// 点击"这一条路径。而重复标签页还会从 window.open()、书签、地址栏、历史记录、外部
// 应用、以及站点自己的 JS 导航里产生 —— 这些都没有 click 事件可拦，只有 tabs
// 事件能看到。两层是互补的：click 拦截更快且没有标签页闪现，这一层负责兜住其余全部。
//
// MV3 里没有能真正取消导航的 API（blocking webRequest 已移除，declarativeNetRequest
// 匹配不了"是否已打开"这种动态状态，webNavigation 只能观察）。onCreated 触发时导航
// 通常还没提交，此时 remove 掉标签页即可取消请求，效果等价。

import { createLogger } from '../shared/logger.js';
import { canonicalizeUrl } from '../shared/url-utils.js';
import { activateTabForUrl } from './tab-deduper.js';

const log = createLogger('tab-guard');

// 创建后继续观察多久，用来捕获重定向落地的最终 URL
// （onCreated 时拿到的 pendingUrl 是重定向之前的）
const REDIRECT_WATCH_MS = 8_000;

// 创建后多久内变成活动标签页，仍算"前台打开"。
// 不能只看 onCreated 时的 tab.active：Chromium 把新标签页插入 tab strip 与更新
// 选中状态是两步，onCreated 派发时选中状态可能还没应用，前台打开的标签页照样会
// 报 active:false。只信这一个字段的话，整条拦截路径会被静默跳过。
// 所以改成：onCreated 时 active 为真，或随后极短时间内 onActivated 命中它，都算前台。
// 真正后台打开的（中键 / Ctrl+点击）在这个窗口内不会变成活动标签页，仍然放过。
const FOREGROUND_GRACE_MS = 1_500;

export class TabGuard {
  /**
   * @param {{
   *   settings: import('./settings-store.js').SettingsStore,
   *   isExcludedWindowId?: (windowId: number) => boolean,
   * }} deps
   */
  constructor({ settings, isExcludedWindowId }) {
    this.settings = settings;
    this.isExcludedWindowId = isExcludedWindowId || (() => false);
    this.enabled = true; // 与 DEFAULT_SETTINGS.smartTabDedup 一致
    this.ready = null;
    /** tabId -> { windowId, openerKey, timer }：仍在观察重定向的新标签页 */
    this.watching = new Map();
    /** 已决定关闭的标签页；匹配时必须排除，否则两个同 URL 的新标签页会互相关掉 */
    this.closing = new Set();
    /** 判定必须串行，理由同上 */
    this.queue = Promise.resolve();
  }

  start() {
    this.ready = this.settings
      .get()
      .then((cur) => {
        this.enabled = cur.smartTabDedup !== false;
      })
      .catch(() => {});

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'sync' || !changes.smartTabDedup) return;
      this.enabled = changes.smartTabDedup.newValue !== false;
      if (!this.enabled) this._unwatchAll();
    });

    chrome.tabs.onCreated.addListener((tab) => this._enqueue(() => this._onCreated(tab)));
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) =>
      this._enqueue(() => this._onUpdated(tabId, changeInfo)),
    );
    chrome.tabs.onActivated.addListener(({ tabId }) =>
      this._enqueue(() => this._onActivated(tabId)),
    );
    chrome.tabs.onRemoved.addListener((tabId) => {
      this._unwatch(tabId);
      this.closing.delete(tabId);
    });
  }

  _enqueue(task) {
    this.queue = this.queue
      .then(task)
      .catch((err) => log.debug('处理标签页事件失败（已忽略）', err?.message));
  }

  async _onCreated(tab) {
    if (tab?.id == null) return;
    // 只在冷启动时真的等一次；之后 enabled 已缓存，判定不再有额外往返
    if (this.ready) await this.ready;
    if (!this.enabled) {
      log.debug('跳过：智能去重已关闭', tab.id);
      return;
    }
    if (this.isExcludedWindowId(tab.windowId)) {
      log.debug('跳过：预加载窗口', tab.id);
      return;
    }

    const openerKey = await this._openerKey(tab.openerTabId);
    this._watch(tab.id, {
      windowId: tab.windowId,
      openerKey,
      url: tab.pendingUrl || tab.url || '',
      foreground: tab.active === true,
      createdAt: Date.now(),
    });
    log.debug('新标签页', tab.id, {
      url: tab.pendingUrl || tab.url || '(空)',
      active: tab.active,
      openerTabId: tab.openerTabId,
      openerKey,
    });

    if (tab.active === true) await this._tryDedupe(tab.id);
  }

  /** onCreated 时可能还没报 active，靠这里补上"前台打开"的判定。 */
  async _onActivated(tabId) {
    const watched = this.watching.get(tabId);
    if (!watched || watched.foreground) return;
    // 超出宽限期说明是用户后来自己切过去的，不是"打开时就在前台"，放过
    if (Date.now() - watched.createdAt > FOREGROUND_GRACE_MS) {
      log.debug('跳过：后台标签页（用户稍后手动切换）', tabId);
      this._unwatch(tabId);
      return;
    }
    watched.foreground = true;
    log.debug('补判为前台打开', tabId);
    await this._tryDedupe(tabId);
  }

  async _onUpdated(tabId, changeInfo) {
    const watched = this.watching.get(tabId);
    if (!watched) return;

    if (changeInfo.url) {
      if (!this.enabled) return this._unwatch(tabId);
      watched.url = changeInfo.url;
      // 后台标签页不处理；若它还在宽限期内变成前台，_onActivated 会用这个新 URL 重判
      if (watched.foreground) await this._tryDedupe(tabId);
      return;
    }
    // 加载完成后 URL 已定型；继续观察就会误伤用户之后自己发起的导航
    if (changeInfo.status === 'complete') this._unwatch(tabId);
  }

  async _tryDedupe(tabId) {
    const watched = this.watching.get(tabId);
    if (!watched) return;
    const { windowId, url, openerKey } = watched;

    const key = canonicalizeUrl(url);
    if (!key) {
      log.debug('暂不处理：URL 还不是 http(s)', tabId, url || '(空)');
      return; // 空白页 / chrome:// / 扩展页，等 onUpdated 带来真正的 URL
    }

    // 来源标签页本身就停在这个网址：用户是在"看着这一页"的情况下又要了一份
    // （点向本页的链接、复制标签页），这是主动意图，放过。
    if (openerKey && openerKey === key) {
      log.debug('跳过：来源页就是同一个网址（主动再开一份）', tabId, key);
      this._unwatch(tabId);
      return;
    }

    const target = await this._findExisting(key, windowId, tabId);
    if (!target) {
      log.debug('未找到重复', tabId, key);
      return;
    }

    this._unwatch(tabId);
    this.closing.add(tabId);
    log.info('拦下重复标签页', url, '-> tab', target.id);

    try {
      // 先激活目标、再关闭新标签页：反过来会让 Chrome 先把焦点丢给邻近标签页，
      // 用户会看到一次多余的跳动。
      await activateTabForUrl(target, url);
      await chrome.tabs.remove(tabId);
    } catch (err) {
      log.warn('关闭重复标签页失败', err?.message);
      this.closing.delete(tabId);
    }
  }

  async _findExisting(key, windowId, excludeTabId) {
    if (windowId == null) return null;
    const tabs = await chrome.tabs.query({ windowId }).catch(() => []);
    return (
      tabs.find((tab) => {
        if (tab.id == null || tab.id === excludeTabId) return false;
        if (this.closing.has(tab.id)) return false;
        return [tab.url, tab.pendingUrl]
          .filter(Boolean)
          .some((tabUrl) => canonicalizeUrl(tabUrl) === key);
      }) || null
    );
  }

  async _openerKey(openerTabId) {
    if (openerTabId == null) return '';
    const opener = await chrome.tabs.get(openerTabId).catch(() => null);
    return canonicalizeUrl(opener?.url || opener?.pendingUrl || '');
  }

  _watch(tabId, info) {
    this._unwatch(tabId);
    const timer = setTimeout(() => this.watching.delete(tabId), REDIRECT_WATCH_MS);
    this.watching.set(tabId, { ...info, timer });
  }

  _unwatch(tabId) {
    const watched = this.watching.get(tabId);
    if (watched?.timer != null) clearTimeout(watched.timer);
    this.watching.delete(tabId);
  }

  _unwatchAll() {
    for (const tabId of [...this.watching.keys()]) this._unwatch(tabId);
  }
}
