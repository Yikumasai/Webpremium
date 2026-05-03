// 深色模式：auto / dark / light，写回 background

import { api } from './api.js';

const ORDER = ['auto', 'dark', 'light'];

export class ThemeManager {
  constructor() {
    this.mode = 'auto';
    this._mq = window.matchMedia('(prefers-color-scheme: dark)');
    this._mq.addEventListener('change', () => this._apply());
  }

  setMode(mode) {
    this.mode = ORDER.includes(mode) ? mode : 'auto';
    this._apply();
  }

  /** 切换到下一档；返回新模式 */
  cycle() {
    const idx = ORDER.indexOf(this.mode);
    const next = ORDER[(idx + 1) % ORDER.length];
    this.setMode(next);
    api.updateSettings({ darkMode: next }).catch(() => {});
    return next;
  }

  _apply() {
    const dark =
      this.mode === 'dark' || (this.mode === 'auto' && this._mq.matches);
    document.body.classList.toggle('dark-mode', dark);
  }
}
