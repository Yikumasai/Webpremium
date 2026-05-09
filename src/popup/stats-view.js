// 统计页

import { api } from './api.js';
import { showToast } from './toast.js';
import { t } from './i18n.js';

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
    if (!confirm(t('resetStatsConfirm'))) return;
    try {
      const res = await api.resetStats();
      if (!res?.success) throw new Error(res?.error);
      await this.refresh();
      showToast(t('statsReset'), 'success');
    } catch {
      showToast(t('resetStatsFailed'), 'error');
    }
  }
}

function formatMs(ms) {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}${t('second')}`;
  return `${Math.round(ms)}ms`;
}

function formatSession(sessionStart) {
  if (!sessionStart) return `0${t('second')}`;
  const diff = Math.max(0, Date.now() - sessionStart);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}${t('second')}`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}${t('minute')}`;
  const hours = Math.floor(minutes / 60);
  return `${hours}${t('hour')}${minutes % 60}${t('minuteShort')}`;
}
