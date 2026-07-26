// content script 侧的"当前窗口已打开页面"缓存。
// 由 background 的 TabIndex 主动推送，保证 click 事件里可以纯同步查询 —— 这是
// 智能去重能可靠拦下点击的前提（异步查询的响应赶不上同一次点击）。

import { MESSAGE } from '../shared/constants.js';
import { canonicalizeUrl } from '../shared/url-utils.js';

export class OpenTabs {
  constructor() {
    /** @type {Map<string, number[]>} 规范化 URL -> tabId 列表 */
    this.byKey = new Map();
    this.selfTabId = null;
  }

  /** 应用一次来自 background 的全量快照。 */
  apply({ entries, yourTabId } = {}) {
    if (yourTabId != null) this.selfTabId = yourTabId;
    this.byKey = new Map();
    for (const { tabId, key } of entries || []) {
      if (tabId == null || !key) continue;
      const list = this.byKey.get(key);
      if (list) list.push(tabId);
      else this.byKey.set(key, [tabId]);
    }
  }

  clear() {
    this.byKey = new Map();
  }

  /** 主动拉取一次快照（首次启用、或页面刚加载时用）。 */
  async sync() {
    try {
      const res = await chrome.runtime.sendMessage({ action: MESSAGE.GET_OPEN_TABS });
      if (res?.success) this.apply(res);
    } catch {
      // background 未就绪，等下一次推送即可
    }
  }

  /**
   * 目标 URL 是否已在当前窗口的其它标签页打开。同步，可在 click 里直接用。
   * @returns {number|null} 命中的 tabId
   */
  findTabId(url) {
    const key = canonicalizeUrl(url);
    if (!key) return null;
    const candidates = this.byKey.get(key);
    if (!candidates) return null;
    return candidates.find((tabId) => tabId !== this.selfTabId) ?? null;
  }

  has(url) {
    return this.findTabId(url) != null;
  }

  /** 乐观移除：跳转失败时立刻让缓存失效，避免下一次点击继续被误拦。 */
  forget(url) {
    const key = canonicalizeUrl(url);
    if (key) this.byKey.delete(key);
  }
}
