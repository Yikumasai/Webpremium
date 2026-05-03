// 管理隐藏的"预加载窗口"，以及其中后台加载的标签页

import { PRELOAD_WINDOW_OPTS } from '../shared/constants.js';
import { createLogger } from '../shared/logger.js';

const log = createLogger('preload-window');

export class PreloadWindow {
  constructor() {
    this.windowId = null;
    this.urlToTab = new Map(); // url -> preloadTabId
    this.tabToUrl = new Map(); // preloadTabId -> url
    /** 发起者信息：preloadTabId -> { ownerTabId, ownerOrigin } */
    this.ownerOf = new Map();

    chrome.windows.onRemoved.addListener((wid) => {
      if (wid === this.windowId) {
        this.windowId = null;
        log.debug('预加载窗口已关闭');
      }
    });

    chrome.tabs.onRemoved.addListener((tabId) => {
      // 情况 1: 被关闭的是一个预加载 tab 自身
      const url = this.tabToUrl.get(tabId);
      if (url) {
        this.urlToTab.delete(url);
        this.tabToUrl.delete(tabId);
        this.ownerOf.delete(tabId);
      }
      // 情况 2: 被关闭的是某个 owner (即使与情况 1 非互斥，也要执行)
      this._evictByOwner(tabId);
    });
  }

  getTabIdForUrl(url) {
    return this.urlToTab.get(url);
  }

  /**
   * 在预加载窗口中新建一个后台标签页。若已有对应 URL 的标签，直接复用。
   * 当 muted=true 时，先创建 about:blank 再静音并导航到目标 URL，避免任何发声窗口期。
   * @param {string} url
   * @param {{ ownerTabId?: number, ownerOrigin?: string, muted?: boolean }} [opts]
   * @returns {Promise<{ tabId: number, reused: boolean }>}
   */
  async openBackgroundTab(url, opts = {}) {
    const { muted = true, ...owner } = opts;

    const existingTabId = this.urlToTab.get(url);
    if (existingTabId != null) {
      try {
        await chrome.tabs.get(existingTabId);
        this._rememberOwner(existingTabId, owner);
        // 复用时也确保 mute 状态跟当前意图一致
        chrome.tabs.update(existingTabId, { muted }).catch(() => {});
        return { tabId: existingTabId, reused: true };
      } catch {
        this.urlToTab.delete(url);
        this.tabToUrl.delete(existingTabId);
        this.ownerOf.delete(existingTabId);
      }
    }

    const windowId = await this._ensureWindow();

    // 关键：先开 about:blank 再静音后导航，确保目标页开始加载时 tab 已静音。
    // 这样即便目标页内有自动播放媒体，也不会有瞬间发声。
    const initialUrl = muted ? 'about:blank' : url;
    const tab = await chrome.tabs.create({ url: initialUrl, windowId, active: false });

    if (tab.windowId !== windowId) {
      await chrome.tabs
        .move(tab.id, { windowId, index: -1 })
        .catch((err) => log.warn('标签页移动失败', err));
    }

    if (muted) {
      try {
        await chrome.tabs.update(tab.id, { muted: true, url });
      } catch (err) {
        log.warn('设置静音并导航失败，回退直接导航', err?.message);
        await chrome.tabs.update(tab.id, { url }).catch(() => {});
      }
    }

    this.urlToTab.set(url, tab.id);
    this.tabToUrl.set(tab.id, url);
    this._rememberOwner(tab.id, owner);
    return { tabId: tab.id, reused: false };
  }

  /**
   * 把预加载标签页移到当前窗口并激活。
   * 注意：有意保留 muted 状态 —— 用户会看到地址栏的静音图标，自己决定是否解除，
   * 避免激活后意外发声（例如视频站自动播放）。
   */
  async activateTab(tabId) {
    const currentWindow = await chrome.windows.getCurrent();
    await chrome.tabs.move(tabId, { windowId: currentWindow.id, index: -1 });
    await chrome.tabs.update(tabId, { active: true });
    await chrome.windows.update(currentWindow.id, { focused: true });

    const url = this.tabToUrl.get(tabId);
    if (url) this.urlToTab.delete(url);
    this.tabToUrl.delete(tabId);
    this.ownerOf.delete(tabId);
  }

  async closeTab(tabId) {
    try {
      await chrome.tabs.remove(tabId);
    } finally {
      const url = this.tabToUrl.get(tabId);
      if (url) this.urlToTab.delete(url);
      this.tabToUrl.delete(tabId);
      this.ownerOf.delete(tabId);
    }
  }

  async clearAll() {
    if (this.windowId != null) {
      await chrome.windows.remove(this.windowId).catch(() => {});
      this.windowId = null;
    }
    this.urlToTab.clear();
    this.tabToUrl.clear();
    this.ownerOf.clear();
  }

  /** 关闭某个 owner tab 发起的所有预加载标签页。 */
  async evictOwner(ownerTabId) {
    await this._evictByOwner(ownerTabId);
  }

  /**
   * 当 owner tab 导航到新 origin 时，关闭其之前在旧 origin 下创建的预加载。
   * 若 newOrigin 与记录的 ownerOrigin 一致则不动。
   */
  async evictOwnerOrigin(ownerTabId, newOrigin) {
    const victims = [];
    for (const [preloadTabId, info] of this.ownerOf) {
      if (info.ownerTabId === ownerTabId && info.ownerOrigin !== newOrigin) {
        victims.push(preloadTabId);
      }
    }
    await this._closeMany(victims);
  }

  _rememberOwner(preloadTabId, { ownerTabId, ownerOrigin } = {}) {
    if (ownerTabId == null) return;
    this.ownerOf.set(preloadTabId, { ownerTabId, ownerOrigin: ownerOrigin || '' });
  }

  async _evictByOwner(ownerTabId) {
    const victims = [];
    for (const [preloadTabId, info] of this.ownerOf) {
      if (info.ownerTabId === ownerTabId) victims.push(preloadTabId);
    }
    await this._closeMany(victims);
  }

  async _closeMany(tabIds) {
    if (tabIds.length === 0) return;
    log.debug('清理预加载', tabIds);
    await Promise.all(tabIds.map((id) => this.closeTab(id).catch(() => {})));
  }

  async _ensureWindow() {
    if (this.windowId != null) {
      try {
        await chrome.windows.get(this.windowId);
        return this.windowId;
      } catch {
        this.windowId = null;
      }
    }

    const win = await chrome.windows.create(PRELOAD_WINDOW_OPTS);
    this.windowId = win.id;
    log.debug('预加载窗口已创建', this.windowId);

    // 立刻最小化，避免干扰用户
    chrome.windows
      .update(this.windowId, { state: 'minimized' })
      .catch((err) => log.debug('最小化失败（已忽略）', err?.message));

    return this.windowId;
  }
}
