// 维护已预加载链接的状态、跟 background 交互、清理

import { MESSAGE, PRELOAD_TIMEOUT_MS } from '../shared/constants.js';
import { createLogger } from '../shared/logger.js';

const log = createLogger('preloader');

/**
 * 单条预加载记录
 * @typedef {Object} Entry
 * @property {'loading'|'loaded'} status
 * @property {number} timestamp
 * @property {'preload-window'|'iframe'} type
 * @property {number=} tabId
 * @property {HTMLAnchorElement=} linkElement
 * @property {HTMLIFrameElement=} iframe
 * @property {ReturnType<typeof setTimeout>=} timeoutId
 */

export class Preloader {
  constructor({ indicator }) {
    /** @type {Map<string, Entry>} */
    this.entries = new Map();
    /** 用户已激活的标签页 ID 集合，避免被 timeout 清理误关 */
    this.activatedTabs = new Set();
    this.indicator = indicator;
  }

  has(href) {
    return this.entries.has(href);
  }

  size() {
    return this.entries.size;
  }

  isLoaded(href) {
    return this.entries.get(href)?.status === 'loaded';
  }

  /**
   * LRU 刷新：把一条记录挪到 Map 末尾，表示"最近用过"。
   * Map 的遍历顺序是插入顺序，delete+set 即可实现 O(1) 重新入队。
   */
  touch(href) {
    const entry = this.entries.get(href);
    if (!entry) return;
    this.entries.delete(href);
    this.entries.set(href, entry);
  }

  /**
   * 淘汰最老的一条预加载（Map 首部），用于超上限时让位给新的预加载。
   * @param {{ keepLoading?: boolean }} [opts]
   *   keepLoading=true 时不淘汰 loading 中的条目（避免打断正在进行的预加载）
   * @returns {Promise<string|null>} 被淘汰的 href，或 null
   */
  async evictOldest({ keepLoading = true } = {}) {
    let victim = null;
    for (const [href, entry] of this.entries) {
      if (keepLoading && entry.status === 'loading') continue;
      victim = href;
      break;
    }
    if (victim) {
      log.debug('LRU 淘汰', victim);
      await this.remove(victim);
    }
    return victim;
  }

  list() {
    return [...this.entries.entries()].map(([href, entry]) => ({
      href,
      status: entry.status,
      timestamp: entry.timestamp,
      type: entry.type,
      tabId: entry.tabId,
    }));
  }

  /**
   * 后台标签页方式预加载
   * @returns {Promise<boolean>} 是否成功
   */
  async preloadWithBackgroundTab(href, linkElement) {
    if (this.entries.has(href)) return true;

    this._setEntry(href, { status: 'loading', type: 'preload-window', linkElement });
    this.indicator.markLoading(linkElement);

    try {
      const res = await chrome.runtime.sendMessage({
        action: MESSAGE.CREATE_BACKGROUND_TAB,
        url: href,
      });
      if (!res?.success) throw new Error(res?.error || '创建预加载标签页失败');

      this._setEntry(href, {
        status: 'loaded',
        type: 'preload-window',
        tabId: res.tabId,
        linkElement,
        timeoutId: this._scheduleTimeout(href, PRELOAD_TIMEOUT_MS['hidden-tab']),
      });
      this.indicator.markLoaded(linkElement);
      return true;
    } catch (err) {
      log.warn('后台标签页预加载失败', href, err.message);
      this.entries.delete(href);
      this.indicator.clear(linkElement);
      return false;
    }
  }

  /** iframe 方式预加载 */
  preloadWithIframe(href, linkElement) {
    if (this.entries.has(href)) return;

    const iframe = document.createElement('iframe');
    iframe.style.cssText =
      'display:none;position:absolute;left:-9999px;width:1px;height:1px;';
    iframe.src = href;
    iframe.sandbox = 'allow-scripts allow-same-origin';
    iframe.allow = "autoplay 'none'";

    this._setEntry(href, { status: 'loading', type: 'iframe', linkElement, iframe });
    this.indicator.markLoading(linkElement);

    iframe.addEventListener('load', () => {
      const entry = this.entries.get(href);
      if (!entry) return;
      this._setEntry(href, {
        ...entry,
        status: 'loaded',
        timeoutId: this._scheduleTimeout(href, PRELOAD_TIMEOUT_MS.iframe),
      });
      this.indicator.markLoaded(linkElement);
    });
    iframe.addEventListener('error', () => {
      this.indicator.clear(linkElement);
      this._removeIframe(href);
      this.entries.delete(href);
    });

    document.body.appendChild(iframe);
  }

  /**
   * 用户点击预加载过的链接：激活后台 tab，并通知 background 记录命中。
   * 返回是否成功打开。
   */
  async openPreloaded(href) {
    const entry = this.entries.get(href);
    if (!entry || entry.status !== 'loaded') return false;

    if (entry.type === 'preload-window' && entry.tabId != null) {
      try {
        await chrome.runtime.sendMessage({
          action: MESSAGE.ACTIVATE_TAB,
          tabId: entry.tabId,
        });
        // 预加载已存在的时长 ≈ 用户本次省下的等待时间
        const savedTime = Math.max(0, Date.now() - entry.timestamp);
        chrome.runtime
          .sendMessage({ action: MESSAGE.RECORD_HIT, savedTime })
          .catch(() => {});
        this.activatedTabs.add(entry.tabId);
        this.indicator.clear(entry.linkElement);
        this._cancelTimeout(entry);
        this.entries.delete(href);
        return true;
      } catch (err) {
        log.warn('激活预加载标签页失败', err.message);
        return false;
      }
    }
    // iframe / 其它类型无法直接"激活"，让浏览器走默认导航
    return false;
  }

  /** 把指定 href 从预加载列表移除（必要时关闭 tab、移除 iframe） */
  async remove(href) {
    const entry = this.entries.get(href);
    if (!entry) return;

    this._cancelTimeout(entry);
    this.indicator.clear(entry.linkElement);

    if (entry.type === 'iframe') {
      this._removeIframe(href);
    } else if (entry.type === 'preload-window' && entry.tabId != null) {
      if (!this.activatedTabs.has(entry.tabId)) {
        chrome.runtime
          .sendMessage({ action: MESSAGE.CLOSE_TAB, tabId: entry.tabId })
          .catch(() => {});
      }
    }
    this.entries.delete(href);
  }

  async clearAll() {
    const hrefs = [...this.entries.keys()];
    await Promise.all(hrefs.map((h) => this.remove(h)));
    this.indicator.clearAll();
  }

  forgetActivatedTab(tabId) {
    this.activatedTabs.delete(tabId);
  }

  _setEntry(href, partial) {
    const prev = this.entries.get(href) || {};
    this.entries.set(href, {
      timestamp: Date.now(),
      ...prev,
      ...partial,
    });
  }

  _scheduleTimeout(href, ms) {
    return setTimeout(() => {
      if (this.entries.has(href)) this.remove(href);
    }, ms);
  }

  _cancelTimeout(entry) {
    if (entry?.timeoutId != null) clearTimeout(entry.timeoutId);
  }

  _removeIframe(href) {
    const entry = this.entries.get(href);
    const iframe = entry?.iframe;
    if (iframe?.parentNode) iframe.parentNode.removeChild(iframe);
  }
}
