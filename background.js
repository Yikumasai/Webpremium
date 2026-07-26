// 链接预加载器 - 后台脚本入口 (Service Worker, ES module)
// 仅做依赖装配 + 系统事件监听；具体逻辑见 src/background/*

import { COMMAND, CONTEXT_MENU, MESSAGE } from './src/shared/constants.js';
import { createLogger } from './src/shared/logger.js';
import { parseUrl } from './src/shared/url-utils.js';
import { SettingsStore } from './src/background/settings-store.js';
import { SiteRulesStore } from './src/background/site-rules.js';
import { StatsStore } from './src/background/stats.js';
import { TabTracker } from './src/background/tab-tracker.js';
import { TabIndex } from './src/background/tab-index.js';
import { PreloadWindow } from './src/background/preload-window.js';
import { createMessageHandler } from './src/background/router.js';
import { findExistingTabByUrl } from './src/background/tab-deduper.js';
import {
  addTabOutFavorite,
  createTabOutContextMenus,
  updateTabOutBadge,
} from './src/background/tab-out.js';

const log = createLogger('bg');

const settings = new SettingsStore();
const siteRules = new SiteRulesStore();
const stats = new StatsStore();
const tabTracker = new TabTracker();
const preloadWindow = new PreloadWindow();
// 隐藏的预加载窗口不算"用户已打开的页面"，从索引里排除
const tabIndex = new TabIndex({
  isExcludedWindowId: (windowId) => windowId === preloadWindow.windowId,
});
tabIndex.start();

// 启动期间并行预热 store
Promise.all([siteRules.ready(), stats.ready()]).catch((err) =>
  log.error('store 初始化失败', err),
);

const handleMessage = createMessageHandler({
  settings,
  siteRules,
  stats,
  preloadWindow,
  tabTracker,
  tabIndex,
});

chrome.runtime.onMessage.addListener(handleMessage);

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await settings.ensureDefaults();
    await siteRules.ensureDefaults();
  }
  await setupContextMenus();
  await updateTabOutBadge(settings);
});

chrome.runtime.onStartup.addListener(() => {
  updateTabOutBadge(settings).catch(() => {});
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync' || !changes.tabOutEnabled) return;
  setupContextMenus().catch(() => {});
  updateTabOutBadge(settings).catch(() => {});
});

chrome.tabs.onCreated.addListener((tab) => {
  updateTabOutBadge(settings).catch(() => {});
});

chrome.tabs.onRemoved.addListener((tabId) => {
  tabTracker.remove(tabId);
  notifyTabClosed(tabId);
  updateTabOutBadge(settings).catch(() => {});
  // owner tab 关闭时，PreloadWindow 内部的 onRemoved 监听会触发 _evictByOwner，
  // 无需在此重复调用。
});

// 当 owner tab 导航到不同 origin 时，清理它遗留的预加载
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  updateTabOutBadge(settings).catch(() => {});
  if (!changeInfo.url) return;
  const newOrigin = parseUrl(changeInfo.url)?.origin || '';
  preloadWindow.evictOwnerOrigin(tabId, newOrigin).catch(() => {});
});

chrome.commands.onCommand.addListener(async (command) => {
  const cur = await settings.get();
  if (cur.shortcutsEnabled !== true) {
    log.debug('快捷键功能已关闭，忽略命令', command);
    return;
  }

  switch (command) {
    case COMMAND.TOGGLE_PRELOAD: {
      const next = { preloadEnabled: !cur.preloadEnabled };
      await settings.update(next);
      settings.broadcast(next);
      break;
    }
    case COMMAND.CLEAR_CACHE:
      await preloadWindow.clearAll();
      tabTracker.clear();
      break;
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case CONTEXT_MENU.PRELOAD_LINK:
      if (info.linkUrl) {
        const cur = await settings.get();
        if (cur.smartTabDedup !== false) {
          const existingTab = await findExistingTabByUrl(info.linkUrl, {
            windowId: tab?.windowId,
            excludeTabId: tab?.id,
          });
          if (existingTab) break;
        }
        const opts = {
          ownerTabId: tab?.id,
          ownerOrigin: parseUrl(tab?.url || '')?.origin || '',
          muted: cur.mutePreload !== false,
        };
        await preloadWindow
          .openBackgroundTab(info.linkUrl, opts)
          .then(({ reused }) => !reused && stats.recordPreload())
          .catch((err) => log.error('右键预加载失败', err));
      }
      break;
    case CONTEXT_MENU.TOGGLE_SITE: {
      if (!tab?.url) return;
      const result = await siteRules.toggleByUrl(tab.url);
      if (result) {
        chrome.tabs
          .sendMessage(tab.id, {
            action: MESSAGE.SITE_RULE_CHANGED,
            domain: result.domain,
            enabled: result.enabled,
          })
          .catch(() => {});
      }
      break;
    }
    case CONTEXT_MENU.TAB_OUT_FAVORITE_PAGE:
      await addTabOutFavorite(tab?.url || '', tab?.title || '').catch((err) =>
        log.warn('Tab-out 收藏当前页失败', err),
      );
      break;
    case CONTEXT_MENU.TAB_OUT_FAVORITE_LINK:
      await addTabOutFavorite(info.linkUrl || '').catch((err) =>
        log.warn('Tab-out 收藏链接失败', err),
      );
      break;
  }
});

async function setupContextMenus() {
  const cur = await settings.get();
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU.PRELOAD_LINK,
      title: '预加载此链接',
      contexts: ['link'],
    });
    chrome.contextMenus.create({
      id: CONTEXT_MENU.TOGGLE_SITE,
      title: '在此网站启用/禁用预加载',
      contexts: ['page'],
    });
    createTabOutContextMenus(cur.tabOutEnabled === true);
  });
}

async function notifyTabClosed(tabId) {
  const tabs = await chrome.tabs.query({}).catch(() => []);
  await Promise.all(
    tabs.map((t) =>
      chrome.tabs
        .sendMessage(t.id, { action: MESSAGE.TAB_CLOSED, tabId })
        .catch(() => {}),
    ),
  );
}
