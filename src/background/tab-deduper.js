// 当前窗口内的目标标签页查找与激活，避免重复打开同一网页。

import { parseUrl } from '../shared/url-utils.js';

export async function findExistingTabByUrl(url, { windowId, excludeTabId } = {}) {
  const targetUrl = normalizeForMatch(url);
  if (!targetUrl) return null;

  const query = windowId != null ? { windowId } : { currentWindow: true };
  const tabs = await chrome.tabs.query(query).catch(() => []);
  return (
    tabs.find((tab) => {
      if (tab.id == null || tab.id === excludeTabId) return false;
      return tabUrls(tab).some((tabUrl) => normalizeForMatch(tabUrl) === targetUrl);
    }) || null
  );
}

export async function activateExistingTabByUrl(url, opts = {}) {
  const tab = await findExistingTabByUrl(url, opts);
  if (!tab?.id) return null;
  await chrome.tabs.update(tab.id, { active: true });
  if (tab.windowId != null) {
    await chrome.windows.update(tab.windowId, { focused: true });
  }
  return tab;
}

export function summarizeTab(tab) {
  if (!tab) return null;
  return {
    id: tab.id,
    windowId: tab.windowId,
    url: tab.url || tab.pendingUrl || '',
    title: tab.title || '',
  };
}

function normalizeForMatch(input) {
  const url = parseUrl(input);
  if (!url || (url.protocol !== 'http:' && url.protocol !== 'https:')) return '';
  url.hash = '';
  return url.href;
}

function tabUrls(tab) {
  return [tab.url, tab.pendingUrl].filter(Boolean);
}
