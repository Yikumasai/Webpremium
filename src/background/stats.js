// 统计：总预加载次数、命中数、节省时间、会话开始时间

import { DEFAULT_STATS, STORAGE_KEYS } from '../shared/constants.js';
import { createLogger } from '../shared/logger.js';

const log = createLogger('stats');

export class StatsStore {
  constructor() {
    this.stats = { ...DEFAULT_STATS, sessionStart: Date.now() };
    this._loaded = this._load();
  }

  async ready() {
    await this._loaded;
    return this;
  }

  async _load() {
    try {
      const { [STORAGE_KEYS.stats]: stored } = await chrome.storage.local.get([
        STORAGE_KEYS.stats,
      ]);
      if (stored) this.stats = { ...this.stats, ...stored };
    } catch (err) {
      log.error('加载统计失败', err);
    }
  }

  async _persist() {
    try {
      await chrome.storage.local.set({ [STORAGE_KEYS.stats]: this.stats });
    } catch (err) {
      log.error('保存统计失败', err);
    }
  }

  snapshot() {
    return { ...this.stats };
  }

  recordPreload() {
    this.stats.totalPreloads += 1;
    this._persist();
  }

  recordHit(savedTime = 0) {
    this.stats.hitCount += 1;
    if (Number.isFinite(savedTime) && savedTime > 0) {
      this.stats.savedTime += savedTime;
    }
    this._persist();
  }

  async reset() {
    this.stats = { ...DEFAULT_STATS, sessionStart: Date.now() };
    await this._persist();
  }
}
