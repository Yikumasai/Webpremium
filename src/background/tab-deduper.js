// 当前窗口内的目标标签页查找与激活，避免重复打开同一网页。
// 比较用的是 canonicalizeUrl 生成的规范化键，而不是 URL 原文 —— 否则尾斜杠、
// http/https、www.、utm_* 参数任意一项不同都会漏判。

import { canonicalizeUrl, parseUrl } from '../shared/url-utils.js';

export async function findExistingTabByUrl(url, { windowId, excludeTabId } = {}) {
  const targetKey = canonicalizeUrl(url);
  if (!targetKey) return null;

  const query = windowId != null ? { windowId } : { currentWindow: true };
  const tabs = await chrome.tabs.query(query).catch(() => []);
  return (
    tabs.find((tab) => {
      if (tab.id == null || tab.id === excludeTabId) return false;
      return tabUrls(tab).some((tabUrl) => canonicalizeUrl(tabUrl) === targetKey);
    }) || null
  );
}

export async function activateExistingTabByUrl(url, opts = {}) {
  const tab = await findExistingTabByUrl(url, opts);
  if (!tab?.id) return null;

  const anchorUrl = fragmentOnlyTarget(url, tab.url || tab.pendingUrl || '');
  // 只在"两个 URL 仅差一个锚点"时补上跳转：这是同文档内定位，不会重新加载页面。
  // 其它差异（如查询参数）一律不动 URL，否则会刷新用户已有的标签页、丢掉页面状态。
  await chrome.tabs.update(tab.id, anchorUrl ? { active: true, url: anchorUrl } : { active: true });
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

function tabUrls(tab) {
  return [tab.url, tab.pendingUrl].filter(Boolean);
}

/**
 * 若 requested 与 current 仅在锚点上不同，且 requested 带了新的锚点，返回 requested；
 * 否则返回 ''（表示不要改动标签页的 URL）。
 */
function fragmentOnlyTarget(requested, current) {
  const wanted = parseUrl(requested);
  const open = parseUrl(current);
  if (!wanted || !open) return '';
  if (!wanted.hash || wanted.hash === open.hash) return '';
  if (wanted.hash.startsWith('#/')) return ''; // hash 路由属于换页，交给普通匹配逻辑
  return stripHash(wanted) === stripHash(open) ? wanted.href : '';
}

function stripHash(url) {
  return `${url.origin}${url.pathname}${url.search}`;
}
