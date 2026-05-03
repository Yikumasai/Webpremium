// content script 的逻辑入口：编排 settings/indicator/preloader/link-tracker

import { MESSAGE } from '../shared/constants.js';
import { createLogger } from '../shared/logger.js';
import { isPreloadableLink } from '../shared/url-utils.js';
import { ContentSettings } from './settings.js';
import { Indicator } from './indicator.js';
import { Preloader } from './preloader.js';
import { LinkTracker } from './link-tracker.js';
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

  let active = false;
  let hoverTimer = null;
  let nearbyTimer = null;
  let lastNearbyHrefs = [];

  // 当前 tab 刚被创建/刷新，先告知 background 清掉旧的预加载残留
  chrome.runtime
    .sendMessage({ action: MESSAGE.CLEAR_MY_PRELOADS })
    .catch(() => {});

  await activateIfEnabled();

  // 监听 site rule 变化、togglePreload、tabClosed
  chrome.runtime.onMessage.addListener((req) => {
    switch (req?.action) {
      case MESSAGE.TOGGLE_PRELOAD:
        settings.values.preloadEnabled = req.enabled;
        activateIfEnabled();
        break;
      case MESSAGE.SITE_RULE_CHANGED:
        activateIfEnabled();
        break;
      case MESSAGE.TAB_CLOSED:
        if (req.tabId != null) preloader.forgetActivatedTab(req.tabId);
        break;
    }
  });

  settings.addEventListener('change', (event) => {
    const changed = event.detail || {};
    if ('showIndicator' in changed) indicator.setEnabled(changed.showIndicator);
    if ('preloadEnabled' in changed) activateIfEnabled();
  });

  async function activateIfEnabled() {
    const allow = settings.values.preloadEnabled && (await isCurrentSiteEnabled());
    if (allow && !active) {
      attachListeners();
      linkTracker.start();
      active = true;
      log.debug('已启用');
    } else if (!allow && active) {
      detachListeners();
      linkTracker.stop();
      preloader.clearAll();
      active = false;
      log.debug('已禁用');
    }
  }

  function attachListeners() {
    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('mouseout', onMouseOut, true);
    document.addEventListener('click', onClick, true);
    window.addEventListener('mousemove', scheduleNearby, { passive: true });
    window.addEventListener('scroll', scheduleNearby, { passive: true });
  }

  function detachListeners() {
    document.removeEventListener('mouseover', onMouseOver, true);
    document.removeEventListener('mouseout', onMouseOut, true);
    document.removeEventListener('click', onClick, true);
    window.removeEventListener('mousemove', scheduleNearby);
    window.removeEventListener('scroll', scheduleNearby);
    if (hoverTimer) clearTimeout(hoverTimer);
    if (nearbyTimer) clearTimeout(nearbyTimer);
    hoverTimer = null;
    nearbyTimer = null;
  }

  function onMouseOver(event) {
    const link = event.target.closest('a[href]');
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

  function onClick(event) {
    const link = event.target.closest('a[href]');
    if (!link || !isPreloadableLink(link.href, link, window.location.href)) return;
    if (!preloader.isLoaded(link.href)) return;
    event.preventDefault();
    event.stopPropagation();
    void preloader.openPreloaded(link.href).then((ok) => {
      if (!ok) window.location.href = link.href;
      notifyPopupSoon();
    });
  }

  async function tryPreload(link) {
    if (preloader.has(link.href)) return;
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

function sameOrder(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return false;
  return true;
}
