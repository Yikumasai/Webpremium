// 统计页

import { api } from './api.js';
import { showToast } from './toast.js';

export class StatsView {
  constructor() {
    const $ = (id) => document.getElementById(id);
    this.els = {
      totalPreloads: $('totalPreloads'),
      hitCount: $('hitCount'),
      hitRate: $('hitRate'),
      savedTime: $('savedTime'),
      sessionTime: $('sessionTime'),
      resetStats: $('resetStats'),
    };
    this.els.resetStats.addEventListener('click', () => this._reset());
  }

  async refresh() {
    try {
      const res = await api.getStats();
      if (res?.success) this._render(res.stats);
    } catch {
      /* ignore */
    }
  }

  _render(stats) {
    this.els.totalPreloads.textContent = stats.totalPreloads || 0;
    this.els.hitCount.textContent = stats.hitCount || 0;

    const rate =
      stats.totalPreloads > 0
        ? ((stats.hitCount / stats.totalPreloads) * 100).toFixed(1)
        : '0.0';
    this.els.hitRate.textContent = `${rate}%`;

    this.els.savedTime.textContent = formatMs(stats.savedTime || 0);
    this.els.sessionTime.textContent = formatSession(stats.sessionStart);
  }

  async _reset() {
    if (!confirm('确定要重置统计数据吗？')) return;
    try {
      const res = await api.resetStats();
      if (!res?.success) throw new Error(res?.error);
      await this.refresh();
      showToast('统计数据已重置', 'success');
    } catch {
      showToast('重置统计失败', 'error');
    }
  }
}

function formatMs(ms) {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}秒`;
  return `${Math.round(ms)}ms`;
}

function formatSession(sessionStart) {
  if (!sessionStart) return '0秒';
  const diff = Math.max(0, Date.now() - sessionStart);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}秒`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  return `${hours}小时${minutes % 60}分`;
}
