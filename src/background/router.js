// 消息路由：把 runtime.onMessage 请求分派到各个 store / manager

import { MESSAGE } from '../shared/constants.js';
import { isHttpUrl, parseUrl } from '../shared/url-utils.js';
import { createLogger } from '../shared/logger.js';

const log = createLogger('router');

/**
 * 构造一个 handler，返回 (request, sender, sendResponse) => boolean
 * true 表示需要保持异步通道。
 */
export function createMessageHandler({
  settings,
  siteRules,
  stats,
  preloadWindow,
  tabTracker,
}) {
  const handlers = {
    [MESSAGE.GET_SETTINGS]: async () => ({
      success: true,
      settings: await settings.get(),
    }),

    [MESSAGE.UPDATE_SETTINGS]: async (req) => {
      await settings.update(req.settings);
      settings.broadcast(req.settings); // 广播，不阻塞响应
      return { success: true };
    },

    [MESSAGE.GET_STATS]: () => ({ success: true, stats: stats.snapshot() }),

    [MESSAGE.RECORD_HIT]: (req) => {
      stats.recordHit(req.savedTime);
      return { success: true };
    },

    [MESSAGE.RESET_STATS]: async () => {
      await stats.reset();
      return { success: true };
    },

    [MESSAGE.GET_SITE_RULES]: () => ({ success: true, rules: siteRules.asObject() }),

    [MESSAGE.UPDATE_SITE_RULE]: async (req) => {
      await siteRules.set(req.domain, req.rule);
      return { success: true };
    },

    [MESSAGE.SET_ALL_RULES_STATUS]: async (req) => {
      await siteRules.setAll(req.enabled);
      return { success: true };
    },

    [MESSAGE.CHECK_SITE_ENABLED]: (req) => ({
      success: true,
      enabled: siteRules.isEnabledForUrl(req.url),
    }),

    [MESSAGE.CREATE_BACKGROUND_TAB]: async (req, sender) => {
      if (!isHttpUrl(req.url)) return { success: false, error: '无效的URL' };
      if (!siteRules.isEnabledForUrl(req.url)) {
        return { success: false, error: '该网站已禁用预加载' };
      }
      const ownerTabId = sender?.tab?.id;
      const ownerOrigin = parseUrl(sender?.tab?.url || '')?.origin || '';
      const cur = await settings.get();
      const { tabId, reused } = await preloadWindow.openBackgroundTab(req.url, {
        ownerTabId,
        ownerOrigin,
        muted: cur.mutePreload !== false,
      });
      if (!reused) stats.recordPreload();
      return { success: true, tabId };
    },

    [MESSAGE.CLEAR_MY_PRELOADS]: async (_req, sender) => {
      const ownerTabId = sender?.tab?.id;
      if (ownerTabId != null) await preloadWindow.evictOwner(ownerTabId);
      return { success: true };
    },

    [MESSAGE.ACTIVATE_TAB]: async (req) => {
      await preloadWindow.activateTab(req.tabId);
      // 命中计数改由 content.js 主动发 RECORD_HIT，避免重复计数
      return { success: true };
    },

    [MESSAGE.CLOSE_TAB]: async (req) => {
      await preloadWindow.closeTab(req.tabId);
      return { success: true };
    },

    [MESSAGE.CLEAR_PRELOADS]: async () => {
      await preloadWindow.clearAll();
      tabTracker.clear();
      return { success: true };
    },

    [MESSAGE.UPDATE_PRELOAD_LIST]: (req, sender) => {
      tabTracker.update(sender.tab?.id, req.preloads, req.nearbyLinks);
      return { success: true };
    },

    [MESSAGE.GET_CURRENT_PRELOADS]: (req, sender) => {
      const tabId = req.tabId ?? sender.tab?.id;
      return { success: true, data: tabTracker.get(tabId) };
    },

    [MESSAGE.PING]: () => ({ success: true, message: 'pong' }),
  };

  return function onMessage(request, sender, sendResponse) {
    const handler = handlers[request?.action];
    if (!handler) {
      sendResponse({ success: false, error: `Unknown action: ${request?.action}` });
      return false;
    }
    Promise.resolve()
      .then(() => handler(request, sender))
      .then((result) => sendResponse(result))
      .catch((err) => {
        log.error(`处理 ${request.action} 失败`, err);
        sendResponse({ success: false, error: err?.message || String(err) });
      });
    return true;
  };
}
