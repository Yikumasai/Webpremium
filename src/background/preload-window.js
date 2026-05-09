// 管理隐藏的"预加载窗口"，以及其中后台加载的标签页

import { PRELOAD_WINDOW_OPTS, PRELOAD_WINDOW_TOLERANCE } from '../shared/constants.js';
import { createLogger } from '../shared/logger.js';

const log = createLogger('preload-window');
const STORAGE_KEY_WINDOW_ID = 'wpPreloadWindowId';
const STORAGE_KEY_WINDOW_IDS = 'wpPreloadWindowIds';

export class PreloadWindow {
  constructor() {
    this.windowId = null;
    this.ensureWindowPromise = null;
    this.urlToTab = new Map(); // url -> preloadTabId
    this.tabToUrl = new Map(); // preloadTabId -> url
    /** 发起者信息：preloadTabId -> { ownerTabId, ownerOrigin } */
    this.ownerOf = new Map();

    chrome.windows.onRemoved.addListener((wid) => {
      if (wid === this.windowId) {
        this.windowId = null;
        log.debug('预加载窗口已关闭');
      }
      this._forgetWindowId(wid).catch(() => {});
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
    this._ensurePlaceholderTab(windowId, tab.id).catch(() => {});
    return { tabId: tab.id, reused: false };
  }

  /**
   * 把预加载标签页移到当前窗口并激活。
   * 注意：有意保留 muted 状态 —— 用户会看到地址栏的静音图标，自己决定是否解除，
   * 避免激活后意外发声（例如视频站自动播放）。
   */
  async activateTab(tabId) {
    const preloadTab = await chrome.tabs.get(tabId).catch(() => null);
    if (preloadTab?.windowId === this.windowId) {
      await this._ensurePlaceholderTab(preloadTab.windowId, tabId);
    }

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
    const tab = await chrome.tabs.get(tabId).catch(() => null);
    if (tab?.windowId === this.windowId) {
      await this._ensurePlaceholderTab(tab.windowId, tabId);
    }

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
    const windowId =
      this.windowId || (await this._restoreWindow()) || (await this._adoptOrphanBlankWindow());

    if (windowId != null) {
      await this._ensurePlaceholderTab(windowId);
      const tabs = await chrome.tabs.query({ windowId }).catch(() => []);
      const preloadTabIds = tabs
        .filter((tab) => !isBlankTab(tab))
        .map((tab) => tab.id)
        .filter((id) => id != null);
      await Promise.all(preloadTabIds.map((id) => chrome.tabs.remove(id).catch(() => {})));
      await this._ensurePlaceholderTab(windowId);
      this.windowId = windowId;
      await this._rememberWindowId(windowId);
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
    if (this.ensureWindowPromise) return this.ensureWindowPromise;
    this.ensureWindowPromise = this._ensureWindowInternal().finally(() => {
      this.ensureWindowPromise = null;
    });
    return this.ensureWindowPromise;
  }

  async _ensureWindowInternal() {
    if (this.windowId != null) {
      try {
        await chrome.windows.get(this.windowId);
        await this._rememberWindowId(this.windowId);
        await this._closeDuplicateTrackedWindows(this.windowId);
        await this._ensurePlaceholderTab(this.windowId);
        return this.windowId;
      } catch {
        this.windowId = null;
      }
    }

    const restoredWindowId = await this._restoreWindow();
    if (restoredWindowId != null) return restoredWindowId;

    const orphanWindowId = await this._adoptOrphanBlankWindow();
    if (orphanWindowId != null) return orphanWindowId;

    const win = await chrome.windows.create(PRELOAD_WINDOW_OPTS);
    this.windowId = win.id;
    await this._rememberWindowId(this.windowId);
    await this._ensurePlaceholderTab(this.windowId);
    log.debug('预加载窗口已创建', this.windowId);

    // 立刻最小化，避免干扰用户
    chrome.windows
      .update(this.windowId, { state: 'minimized' })
      .catch((err) => log.debug('最小化失败（已忽略）', err?.message));

    return this.windowId;
  }

  async _restoreWindow() {
    const windowIds = await this._storedWindowIds();
    if (windowIds.length === 0) return null;

    const aliveWindows = [];
    for (const id of windowIds) {
      const win = await chrome.windows.get(id, { populate: true }).catch(() => null);
      if (win?.id != null) aliveWindows.push(win);
    }

    if (aliveWindows.length === 0) {
      await chrome.storage.local.remove([STORAGE_KEY_WINDOW_ID, STORAGE_KEY_WINDOW_IDS]);
      return null;
    }

    // 如果历史上已经泄漏出多个预加载窗口，保留内容最多的一个，其余关闭。
    aliveWindows.sort((a, b) => nonBlankTabCount(b) - nonBlankTabCount(a));
    const keep = aliveWindows[0];
    this.windowId = keep.id;
    await this._rememberWindowId(keep.id);
    await this._closeDuplicateTrackedWindows(keep.id, aliveWindows.slice(1));
    await this._ensurePlaceholderTab(keep.id);

    chrome.windows
      .update(keep.id, { state: 'minimized' })
      .catch((err) => log.debug('最小化已恢复的预加载窗口失败（已忽略）', err?.message));

    log.debug('复用已存在的预加载窗口', keep.id);
    return keep.id;
  }

  async _adoptOrphanBlankWindow() {
    const windows = await chrome.windows
      .getAll({ populate: true, windowTypes: ['normal'] })
      .catch(() => []);
    const candidates = windows.filter((win) => isLikelyOrphanBlankPreloadWindow(win));
    if (candidates.length === 0) return null;

    candidates.sort((a, b) => a.id - b.id);
    const keep = candidates[0];
    this.windowId = keep.id;
    await this._rememberWindowId(keep.id);

    await Promise.all(
      candidates.slice(1).map((win) => chrome.windows.remove(win.id).catch(() => {})),
    );
    await chrome.storage.local.set({
      [STORAGE_KEY_WINDOW_ID]: keep.id,
      [STORAGE_KEY_WINDOW_IDS]: [keep.id],
    });

    chrome.windows
      .update(keep.id, { state: 'minimized' })
      .catch((err) => log.debug('最小化收养的预加载窗口失败（已忽略）', err?.message));

    log.debug('复用遗留空白预加载窗口', keep.id);
    return keep.id;
  }

  async _closeDuplicateTrackedWindows(keepWindowId, knownDuplicates = null) {
    const duplicates = knownDuplicates || [];
    if (!knownDuplicates) {
      for (const id of await this._storedWindowIds()) {
        if (id === keepWindowId) continue;
        const win = await chrome.windows.get(id).catch(() => null);
        if (win?.id != null) duplicates.push(win);
      }
    }

    await Promise.all(
      duplicates.map((win) => chrome.windows.remove(win.id).catch(() => {})),
    );
    await chrome.storage.local.set({
      [STORAGE_KEY_WINDOW_ID]: keepWindowId,
      [STORAGE_KEY_WINDOW_IDS]: [keepWindowId],
    });
  }

  async _ensurePlaceholderTab(windowId, closingTabId = null) {
    const tabs = await chrome.tabs.query({ windowId }).catch(() => []);
    const hasBlankTab = tabs.some((tab) => tab.id !== closingTabId && isBlankTab(tab));
    if (hasBlankTab) return;
    await chrome.tabs.create({ windowId, url: 'about:blank', active: false }).catch(() => {});
  }

  async _storedWindowIds() {
    const stored = await chrome.storage.local
      .get([STORAGE_KEY_WINDOW_ID, STORAGE_KEY_WINDOW_IDS])
      .catch(() => ({}));
    const ids = new Set();
    if (Number.isInteger(stored[STORAGE_KEY_WINDOW_ID])) ids.add(stored[STORAGE_KEY_WINDOW_ID]);
    if (Array.isArray(stored[STORAGE_KEY_WINDOW_IDS])) {
      stored[STORAGE_KEY_WINDOW_IDS]
        .filter((id) => Number.isInteger(id))
        .forEach((id) => ids.add(id));
    }
    return [...ids];
  }

  async _rememberWindowId(windowId) {
    if (!Number.isInteger(windowId)) return;
    const ids = new Set(await this._storedWindowIds());
    ids.add(windowId);
    await chrome.storage.local.set({
      [STORAGE_KEY_WINDOW_ID]: windowId,
      [STORAGE_KEY_WINDOW_IDS]: [...ids],
    });
  }

  async _forgetWindowId(windowId) {
    const ids = new Set(await this._storedWindowIds());
    ids.delete(windowId);
    const next = [...ids];
    await chrome.storage.local.set({
      [STORAGE_KEY_WINDOW_ID]: next[0] ?? null,
      [STORAGE_KEY_WINDOW_IDS]: next,
    });
  }
}

function isBlankTab(tab) {
  const url = tab?.url || tab?.pendingUrl || '';
  return url === '' || url === 'about:blank';
}

function nonBlankTabCount(win) {
  return (win.tabs || []).filter((tab) => !isBlankTab(tab)).length;
}

function isLikelyOrphanBlankPreloadWindow(win) {
  const tabs = win?.tabs || [];
  if (win?.type !== PRELOAD_WINDOW_OPTS.type) return false;
  if (tabs.length !== 1 || !isBlankTab(tabs[0])) return false;

  const width = typeof win.width === 'number' ? win.width : PRELOAD_WINDOW_OPTS.width;
  const height = typeof win.height === 'number' ? win.height : PRELOAD_WINDOW_OPTS.height;
  const left = typeof win.left === 'number' ? win.left : PRELOAD_WINDOW_OPTS.left;
  const top = typeof win.top === 'number' ? win.top : PRELOAD_WINDOW_OPTS.top;

  return (
    width <= PRELOAD_WINDOW_OPTS.width + PRELOAD_WINDOW_TOLERANCE.width &&
    height <= PRELOAD_WINDOW_OPTS.height + PRELOAD_WINDOW_TOLERANCE.height &&
    Math.abs(left - PRELOAD_WINDOW_OPTS.left) <= PRELOAD_WINDOW_TOLERANCE.left &&
    Math.abs(top - PRELOAD_WINDOW_OPTS.top) <= PRELOAD_WINDOW_TOLERANCE.top
  );
}
