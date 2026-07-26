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
    if (!this.enabled) return;

    // 后台打开的一律放过：中键 / Ctrl+点击 表示"我明确要再开一个"，
    // 预加载标签页也是后台创建的，这条同时把它们排除掉了。
    if (tab.active !== true) return;
    if (this.isExcludedWindowId(tab.windowId)) return;

    const openerKey = await this._openerKey(tab.openerTabId);
    this._watch(tab.id, { windowId: tab.windowId, openerKey });
    await this._tryDedupe(tab.id, tab.windowId, tab.pendingUrl || tab.url || '', openerKey);
  }

  async _onUpdated(tabId, changeInfo) {
    const watched = this.watching.get(tabId);
    if (!watched) return;

    if (changeInfo.url) {
      if (!this.enabled) return this._unwatch(tabId);
      await this._tryDedupe(tabId, watched.windowId, changeInfo.url, watched.openerKey);
      return;
    }
    // 加载完成后 URL 已定型；继续观察就会误伤用户之后自己发起的导航
    if (changeInfo.status === 'complete') this._unwatch(tabId);
  }

  async _tryDedupe(tabId, windowId, url, openerKey) {
    const key = canonicalizeUrl(url);
    if (!key) return; // 空白页 / chrome:// / 扩展页

    // 来源标签页本身就停在这个网址：用户是在"看着这一页"的情况下又要了一份
    // （点向本页的链接、复制标签页），这是主动意图，放过。
    if (openerKey && openerKey === key) {
      this._unwatch(tabId);
      return;
    }

    const target = await this._findExisting(key, windowId, tabId);
    if (!target) return;

    this._unwatch(tabId);
    this.closing.add(tabId);
    log.debug('拦下重复标签页', url, '-> tab', target.id);

    try {
      // 先激活目标、再关闭新标签页：反过来会让 Chrome 先把焦点丢给邻近标签页，
      // 用户会看到一次多余的跳动。
      await activateTabForUrl(target, url);
      await chrome.tabs.remove(tabId);
    } catch (err) {
      log.debug('关闭重复标签页失败', err?.message);
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
