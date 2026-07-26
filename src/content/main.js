// content script 的逻辑入口：编排 settings/indicator/preloader/link-tracker/open-tabs

import { MESSAGE } from '../shared/constants.js';
import { createLogger } from '../shared/logger.js';
import { isDedupCandidateLink, isPreloadableLink } from '../shared/url-utils.js';
import { ContentSettings } from './settings.js';
import { Indicator } from './indicator.js';
import { Preloader } from './preloader.js';
import { LinkTracker } from './link-tracker.js';
import { OpenTabs } from './open-tabs.js';
import { shouldPreloadOnCurrentNetwork } from './network-aware.js';

const log = createLogger('content');
const NEARBY_DEBOUNCE_MS = 200;

export async function run() {
  const settings = new ContentSettings();
  await settings.load();
  settings.attachRuntimeListener();

  const indicator = new Indicator({ enabled: settings.values.showIndicator });
  const preloader = new Preloader({ indicator });
  const linkTracker = new LinkTracker();
  const openTabs = new OpenTabs();

  // 预加载与智能去重是两个互相独立的开关，各自维护自己的启用状态：
  // 关掉预加载（或在本站禁用预加载）不应该顺带让去重失效。
  let preloadActive = false;
  let dedupActive = false;
  let clickAttached = false;
  let hoverTimer = null;
  let nearbyTimer = null;
  let lastNearbyHrefs = [];

  // 当前 tab 刚被创建/刷新，先告知 background 清掉旧的预加载残留
  chrome.runtime
    .sendMessage({ action: MESSAGE.CLEAR_MY_PRELOADS })
    .catch(() => {});

  // 先挂监听再激活，避免激活期间到达的索引推送被漏掉
  // 监听 site rule 变化、togglePreload、tabClosed、已打开标签页索引推送
  chrome.runtime.onMessage.addListener((req) => {
    switch (req?.action) {
      case MESSAGE.TOGGLE_PRELOAD:
        settings.values.preloadEnabled = req.enabled;
        void refreshActivation();
        break;
      case MESSAGE.SITE_RULE_CHANGED:
        void refreshActivation();
        break;
      case MESSAGE.TAB_CLOSED:
        if (req.tabId != null) preloader.forgetActivatedTab(req.tabId);
        break;
      case MESSAGE.OPEN_TABS_CHANGED:
        if (dedupActive) openTabs.apply(req);
        break;
    }
  });

  settings.addEventListener('change', (event) => {
    const changed = event.detail || {};
    if ('showIndicator' in changed) indicator.setEnabled(changed.showIndicator);
    if ('preloadEnabled' in changed || 'smartTabDedup' in changed) void refreshActivation();
  });

  await refreshActivation();

  async function refreshActivation() {
    await refreshPreloadActivation();
    refreshDedupActivation();
    syncClickListener();
  }

  async function refreshPreloadActivation() {
    const allow = settings.values.preloadEnabled && (await isCurrentSiteEnabled());
    if (allow && !preloadActive) {
      attachPreloadListeners();
      linkTracker.start();
      preloadActive = true;
      log.debug('预加载已启用');
    } else if (!allow && preloadActive) {
      detachPreloadListeners();
      linkTracker.stop();
      preloader.clearAll();
      preloadActive = false;
      log.debug('预加载已禁用');
    }
  }

  function refreshDedupActivation() {
    const allow = settings.values.smartTabDedup !== false;
    if (allow === dedupActive) return;
    dedupActive = allow;
    if (allow) {
      // sync 期间用户可能又关掉了开关，回来时再确认一次
      void openTabs.sync().then(() => {
        if (!dedupActive) openTabs.clear();
      });
      log.debug('智能去重已启用');
    } else {
      openTabs.clear();
      log.debug('智能去重已禁用');
    }
  }

  /** click 监听由两个功能共用，任一启用就挂上。 */
  function syncClickListener() {
    const needed = preloadActive || dedupActive;
    if (needed === clickAttached) return;
    clickAttached = needed;
    if (needed) document.addEventListener('click', onClick, true);
    else document.removeEventListener('click', onClick, true);
  }

  function attachPreloadListeners() {
    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('mouseout', onMouseOut, true);
    window.addEventListener('mousemove', scheduleNearby, { passive: true });
    window.addEventListener('scroll', scheduleNearby, { passive: true });
  }

  function detachPreloadListeners() {
    document.removeEventListener('mouseover', onMouseOver, true);
    document.removeEventListener('mouseout', onMouseOut, true);
    window.removeEventListener('mousemove', scheduleNearby);
    window.removeEventListener('scroll', scheduleNearby);
    if (hoverTimer) clearTimeout(hoverTimer);
    if (nearbyTimer) clearTimeout(nearbyTimer);
    hoverTimer = null;
    nearbyTimer = null;
  }

  function onMouseOver(event) {
    const link = closestLink(event);
    if (!link || !isPreloadableLink(link.href, link, window.location.href)) return;
    if (preloader.has(link.href)) {
      // 再次 hover 到已预加载的链接 -> 刷新 LRU，避免被淘汰
      preloader.touch(link.href);
      return;
    }
    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      hoverTimer = null;
      void tryPreload(link);
    }, settings.values.hoverDelay);
  }

  function onMouseOut() {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
  }

  /**
   * 点击处理分两级，都必须在同步阶段决定是否 preventDefault：
   *   1. 目标页已在当前窗口打开 -> 拦下点击，跳转到那个标签页
   *   2. 目标页已预加载        -> 拦下点击，激活预加载标签页
   * 两者都不成立时完全放行 —— 不能推测性地 preventDefault，否则会把 SPA 的
   * 客户端路由降级成整页刷新，并且吞掉站点自己的点击处理。
   */
  function onClick(event) {
    const link = closestLink(event);
    if (!link) return;
    const href = link.href;

    if (
      dedupActive &&
      isDedupNavigationClick(event, link) &&
      isDedupCandidateLink(href, link, window.location.href) &&
      openTabs.has(href)
    ) {
      event.preventDefault();
      event.stopPropagation();
      void activateExistingTab(href).then((ok) => {
        if (ok) {
          // 同一个页面已经有真实标签页了，顺手回收为它做的预加载
          if (preloader.has(href)) void preloader.remove(href);
        } else {
          openTabs.forget(href); // 索引已过期，别让下一次点击继续被误拦
          navigateToLink(link);
        }
        notifyPopupSoon();
      });
      return;
    }

    if (!preloadActive) return;
    if (!isPreloadableLink(href, link, window.location.href)) return;
    if (!preloader.isLoaded(href)) return;
    event.preventDefault();
    event.stopPropagation();
    void preloader.openPreloaded(href).then((ok) => {
      if (!ok) navigateToLink(link);
      notifyPopupSoon();
    });
  }

  async function tryPreload(link) {
    if (preloader.has(link.href)) return;
    if (dedupActive && openTabs.has(link.href)) {
      log.debug('目标已在当前窗口打开，跳过预加载', link.href);
      return;
    }

    if (!shouldPreloadOnCurrentNetwork(settings.values)) {
      log.debug('网络不佳，跳过', link.href);
      return;
    }
    // LRU：超上限先淘汰最老的已 loaded 项。全部在 loading 则跳过本次。
    if (preloader.size() >= settings.values.maxPreloads) {
      await preloader.evictOldest({ keepLoading: true });
      if (preloader.size() >= settings.values.maxPreloads) {
        log.debug('已达上限且无可淘汰', preloader.size());
        return;
      }
    }
    if (!(await isCurrentSiteEnabled())) return;

    const useTab = settings.values.preloadMode === 'hidden-tab';
    if (useTab) {
      await preloader.preloadWithBackgroundTab(link.href, link);
    } else {
      preloader.preloadWithIframe(link.href, link);
    }
    notifyPopupSoon();
  }

  function scheduleNearby() {
    if (nearbyTimer) return;
    nearbyTimer = setTimeout(() => {
      nearbyTimer = null;
      const nearby = linkTracker.getNearby(settings.values.maxPreloads);
      const hrefs = nearby.map((n) => n.href);
      if (!sameOrder(hrefs, lastNearbyHrefs)) {
        lastNearbyHrefs = hrefs;
        notifyPopup(nearby);
      }
    }, NEARBY_DEBOUNCE_MS);
  }

  function notifyPopupSoon() {
    scheduleNearby();
  }

  function notifyPopup(nearby) {
    const preloads = preloader.list().map((p) => ({
      href: p.href,
      status: p.status,
      timestamp: p.timestamp,
      type: p.type,
      tabId: p.tabId,
      title: titleOf(p.href),
    }));
    const nearbyLinks = nearby.map(({ link, distance, href }) => ({
      href,
      distance: Math.round(distance),
      title: (link.textContent || '').trim().slice(0, 50) || href,
    }));
    chrome.runtime
      .sendMessage({
        action: MESSAGE.UPDATE_PRELOAD_LIST,
        preloads,
        nearbyLinks,
      })
      .catch(() => {});
  }

  function titleOf(href) {
    try {
      const el = document.querySelector(`a[href="${CSS.escape(href)}"]`);
      const text = (el?.textContent || '').trim();
      return text.slice(0, 50) || href;
    } catch {
      return href;
    }
  }

  async function activateExistingTab(href) {
    try {
      const res = await chrome.runtime.sendMessage({
        action: MESSAGE.ACTIVATE_EXISTING_TAB,
        url: href,
      });
      return Boolean(res?.success && res.activated);
    } catch (err) {
      log.warn('激活已有标签页失败', err?.message);
      return false;
    }
  }

  async function isCurrentSiteEnabled() {
    try {
      const res = await chrome.runtime.sendMessage({
        action: MESSAGE.CHECK_SITE_ENABLED,
        url: window.location.href,
      });
      return Boolean(res?.success && res.enabled !== false);
    } catch {
      return false;
    }
  }
}

function closestLink(event) {
  const target = event.target;
  return typeof target?.closest === 'function' ? target.closest('a[href]') : null;
}

function sameOrder(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return false;
  return true;
}

/** 普通左键点击（无修饰键），且 target 是当前页或新标签页 —— 只有这类点击才拦。 */
function isDedupNavigationClick(event, link) {
  const target = (link.getAttribute('target') || '').toLowerCase();
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    (!target || target === '_self' || target === '_blank')
  );
}

function navigateToLink(link) {
  const target = (link.getAttribute('target') || '').toLowerCase();
  if (target && target !== '_self') {
    window.open(link.href, target);
    return;
  }
  window.location.href = link.href;
}
