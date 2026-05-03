// 跟踪页面上的可预加载链接：
//  - IntersectionObserver 维护"视口内"链接集合
//  - MutationObserver 监听新增/删除 <a>
//  - mousemove 节流更新鼠标位置
//  - 提供 getNearby(n) 计算最靠近鼠标的 n 条

import { isPreloadableLink } from '../shared/url-utils.js';

const MOUSE_THROTTLE_MS = 50;

export class LinkTracker {
  constructor() {
    /** 当前在视口中的可预加载 <a> 集合 */
    this.visibleLinks = new Set();
    this.mouseX = 0;
    this.mouseY = 0;
    this._lastMouseAt = 0;
    this._observer = null;
    this._mutationObserver = null;
    this._mouseHandler = null;
  }

  start() {
    // 初始位置：页面中心，避免没有 mousemove 时所有距离为 0
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;

    this._observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = /** @type {HTMLAnchorElement} */ (entry.target);
          if (entry.isIntersecting) {
            if (this._isCandidate(target)) this.visibleLinks.add(target);
          } else {
            this.visibleLinks.delete(target);
          }
        }
      },
      { rootMargin: '200px' },
    );
    this._observeAll();

    this._mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => this._observeAnchorsIn(node));
        m.removedNodes.forEach((node) => this._unobserveAnchorsIn(node));
      }
    });
    this._mutationObserver.observe(document.body, { childList: true, subtree: true });

    this._mouseHandler = (e) => {
      const now = performance.now();
      if (now - this._lastMouseAt < MOUSE_THROTTLE_MS) return;
      this._lastMouseAt = now;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    };
    document.addEventListener('mousemove', this._mouseHandler, { passive: true });
  }

  stop() {
    this._observer?.disconnect();
    this._mutationObserver?.disconnect();
    if (this._mouseHandler) {
      document.removeEventListener('mousemove', this._mouseHandler);
    }
    this._observer = null;
    this._mutationObserver = null;
    this._mouseHandler = null;
    this.visibleLinks.clear();
  }

  /** 计算距离鼠标最近的 N 条可预加载链接（仅来自视口内） */
  getNearby(n) {
    const items = [];
    for (const link of this.visibleLinks) {
      if (!link.isConnected) {
        this.visibleLinks.delete(link);
        continue;
      }
      const rect = link.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - this.mouseX;
      const dy = cy - this.mouseY;
      items.push({ link, distance: Math.sqrt(dx * dx + dy * dy), href: link.href });
    }
    items.sort((a, b) => a.distance - b.distance);
    return items.slice(0, n);
  }

  _observeAll() {
    document.querySelectorAll('a[href]').forEach((a) => {
      if (this._isCandidate(a)) this._observer.observe(a);
    });
  }

  _observeAnchorsIn(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches?.('a[href]') && this._isCandidate(node)) {
      this._observer.observe(node);
    }
    node.querySelectorAll?.('a[href]').forEach((a) => {
      if (this._isCandidate(a)) this._observer.observe(a);
    });
  }

  _unobserveAnchorsIn(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches?.('a[href]')) {
      this._observer.unobserve(node);
      this.visibleLinks.delete(node);
    }
    node.querySelectorAll?.('a[href]').forEach((a) => {
      this._observer.unobserve(a);
      this.visibleLinks.delete(a);
    });
  }

  _isCandidate(linkElement) {
    return isPreloadableLink(linkElement.href, linkElement, window.location.href);
  }
}
