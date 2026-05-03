// 链接预加载状态指示器：CSS 注入 + class 切换

const STYLE_ID = 'wp-preload-indicator-style';
const STYLE_TEXT = `
.wp-preload-indicator { position: relative; }
.wp-preload-indicator::after {
  content: '';
  position: absolute;
  top: -2px;
  right: -8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4caf50;
  opacity: 0.8;
  animation: wp-preload-pulse 1.5s infinite;
  pointer-events: none;
}
.wp-preload-indicator.wp-loading::after { background: #ff9800; }
@keyframes wp-preload-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}
`;

export class Indicator {
  constructor({ enabled = true } = {}) {
    this.enabled = enabled;
    if (enabled) this.injectStyles();
  }

  injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = STYLE_TEXT;
    (document.head || document.documentElement).appendChild(style);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (enabled) this.injectStyles();
  }

  markLoading(el) {
    if (!this.enabled || !el) return;
    el.classList.add('wp-preload-indicator', 'wp-loading');
  }

  markLoaded(el) {
    if (!this.enabled || !el) return;
    el.classList.add('wp-preload-indicator');
    el.classList.remove('wp-loading');
  }

  clear(el) {
    if (!el) return;
    el.classList.remove('wp-preload-indicator', 'wp-loading');
  }

  clearAll(root = document) {
    root.querySelectorAll('.wp-preload-indicator').forEach((el) => this.clear(el));
  }
}
