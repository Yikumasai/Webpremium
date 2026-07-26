// 维护"每个窗口里已打开哪些网页"的规范化索引，并主动推送给该窗口内的 content script。
//
// 为什么需要推送：content script 必须在 click 事件的同步阶段就知道"目标页是否已打开"，
// 才能决定要不要 preventDefault。原先的做法是在 mousedown 里发消息问 background，
// 但 mousedown → click 只隔几十毫秒，而 MV3 service worker 空闲会休眠、冷启动往返
// 轻易超过 100ms，响应基本赶不上这次点击 —— 于是浏览器照常打开了重复的标签页。
// 改成推送后，判定完全在本地同步完成，不存在竞态。

import { MESSAGE } from '../shared/constants.js';
import { canonicalizeUrl } from '../shared/url-utils.js';
import { createLogger } from '../shared/logger.js';

const log = createLogger('tab-index');
const PUSH_DEBOUNCE_MS = 120;

export class TabIndex {
  /**
   * @param {{ isExcludedWindowId?: (windowId: number) => boolean }} [opts]
   *   isExcludedWindowId 用于排除隐藏的预加载窗口 —— 那里的标签页由 preloader
   *   自己管理，不该被当成"用户已打开的页面"。
   */
  constructor({ isExcludedWindowId } = {}) {
    this.isExcludedWindowId = isExcludedWindowId || (() => false);
    /** windowId -> 上次推送的内容签名，用于跳过无变化的推送 */
    this.lastSignature = new Map();
    this.dirtyWindows = new Set();
    this.pushTimer = null;
  }

  start() {
    chrome.tabs.onCreated.addListener((tab) => this._markDirty(tab?.windowId));

    chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
      // 只关心 URL 变化；status=complete 用来兜住重定向后落地的最终 URL
      if (!changeInfo.url && changeInfo.status !== 'complete') return;
      this._markDirty(tab?.windowId);
    });

    chrome.tabs.onRemoved.addListener((_tabId, info) => this._markDirty(info?.windowId));
    chrome.tabs.onAttached.addListener((_tabId, info) => this._markDirty(info?.newWindowId));
    chrome.tabs.onDetached.addListener((_tabId, info) => this._markDirty(info?.oldWindowId));
    chrome.tabs.onReplaced.addListener(() => this._markAllDirty());
    chrome.windows.onRemoved.addListener((windowId) => this.lastSignature.delete(windowId));
  }

  /**
   * 某个窗口内已打开页面的规范化索引。
   * @returns {Promise<Array<{ tabId: number, key: string }>>}
   */
  async entriesForWindow(windowId) {
    if (windowId == null || this.isExcludedWindowId(windowId)) return [];
    const tabs = await chrome.tabs.query({ windowId }).catch(() => []);
    const entries = [];
    for (const tab of tabs) {
      if (tab.id == null) continue;
      const key = canonicalizeUrl(tab.url || tab.pendingUrl || '');
      if (key) entries.push({ tabId: tab.id, key });
    }
    return entries;
  }

  /** 立刻把某窗口的索引推给窗口内所有标签页（内容无变化时静默跳过）。 */
  async pushWindow(windowId) {
    if (windowId == null || this.isExcludedWindowId(windowId)) return;

    const entries = await this.entriesForWindow(windowId);
    const signature = entries
      .map((e) => `${e.tabId}|${e.key}`)
      .sort()
      .join('\n');
    if (this.lastSignature.get(windowId) === signature) return;
    this.lastSignature.set(windowId, signature);

    await Promise.all(
      entries.map(({ tabId }) =>
        chrome.tabs
          .sendMessage(tabId, {
            action: MESSAGE.OPEN_TABS_CHANGED,
            entries,
            yourTabId: tabId,
          })
          .catch(() => {}), // 没有 content script 的页面（新标签页、商店页等）会失败，忽略
      ),
    );
  }

  _markDirty(windowId) {
    if (windowId == null || this.isExcludedWindowId(windowId)) return;
    this.dirtyWindows.add(windowId);
    this._scheduleFlush();
  }

  _markAllDirty() {
    chrome.windows
      .getAll()
      .then((windows) => windows.forEach((win) => this._markDirty(win.id)))
      .catch(() => {});
  }

  _scheduleFlush() {
    if (this.pushTimer != null) return;
    this.pushTimer = setTimeout(() => {
      this.pushTimer = null;
      const windowIds = [...this.dirtyWindows];
      this.dirtyWindows.clear();
      Promise.all(windowIds.map((id) => this.pushWindow(id).catch(() => {}))).catch((err) =>
        log.debug('推送标签页索引失败（已忽略）', err?.message),
      );
    }, PUSH_DEBOUNCE_MS);
  }
}
