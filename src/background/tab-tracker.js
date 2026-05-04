// 跟踪 content script 上报的预加载列表和附近链接，按 tabId 索引

export class TabTracker {
  constructor() {
    this.preloadsByTab = new Map();
    this.nearbyByTab = new Map();
  }

  update(tabId, preloads, nearbyLinks) {
    if (tabId == null) return;
    this.preloadsByTab.set(tabId, preloads || []);
    this.nearbyByTab.set(tabId, nearbyLinks || []);
  }

  get(tabId) {
    return {
      preloads: this.preloadsByTab.get(tabId) || [],
      nearbyLinks: this.nearbyByTab.get(tabId) || [],
    };
  }

  remove(tabId) {
    this.preloadsByTab.delete(tabId);
    this.nearbyByTab.delete(tabId);
  }

  clear() {
    this.preloadsByTab.clear();
    this.nearbyByTab.clear();
  }
}
