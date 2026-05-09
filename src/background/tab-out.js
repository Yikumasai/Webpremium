// Tab-out: new-tab dashboard redirect, badge count, and favorites context menu.

import { CONTEXT_MENU, INTERNAL_URL_PREFIXES, STORAGE_KEYS } from '../shared/constants.js';
import { brandFromHostname } from '../shared/url-utils.js';

const TAB_OUT_PAGE = 'index.html';

export function tabOutUrl() {
  return chrome.runtime.getURL(TAB_OUT_PAGE);
}

export function createTabOutContextMenus(enabled) {
  if (!enabled) return;
  chrome.contextMenus.create({
    id: CONTEXT_MENU.TAB_OUT_FAVORITE_PAGE,
    title: 'Add page to tab-home favorites',
    contexts: ['page'],
  });
  chrome.contextMenus.create({
    id: CONTEXT_MENU.TAB_OUT_FAVORITE_LINK,
    title: 'Add link to tab-home favorites',
    contexts: ['link'],
  });
}

export async function maybeRedirectNewTabToTabOut(tab, settings) {
  if (!tab?.id || !(await isEnabled(settings))) return false;
  const url = tab.pendingUrl || tab.url || '';
  if (!isBrowserNewTabUrl(url)) return false;
  await chrome.tabs.update(tab.id, { url: tabOutUrl() }).catch(() => {});
  return true;
}

export async function updateTabOutBadge(settings) {
  if (!(await isEnabled(settings))) {
    await chrome.action.setBadgeText({ text: '' }).catch(() => {});
    return;
  }

  try {
    const tabs = await chrome.tabs.query({});
    const count = tabs.filter((tab) => isRealWebTab(tab)).length;
    await chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });
    if (count > 0) {
      await chrome.action.setBadgeBackgroundColor({ color: badgeColor(count) });
    }
  } catch {
    chrome.action.setBadgeText({ text: '' }).catch(() => {});
  }
}

export async function addTabOutFavorite(url, title = '') {
  if (!isFavoriteUrl(url)) return false;
  const stored = await chrome.storage.local.get(STORAGE_KEYS.favorites).catch(() => ({}));
  const favorites = Array.isArray(stored[STORAGE_KEYS.favorites]) ? stored[STORAGE_KEYS.favorites] : [];
  if (favorites.some((item) => item.url === url)) return false;

  const taken = new Set(favorites.map((item) => item.slot));
  let slot = 0;
  while (taken.has(slot)) slot += 1;

  const favorite = {
    id: Date.now().toString(),
    url,
    title: title || brandFromUrl(url),
    addedAt: new Date().toISOString(),
    slot,
  };

  await chrome.storage.local.set({ [STORAGE_KEYS.favorites]: [...favorites, favorite] });
  return true;
}

export function isBrowserNewTabUrl(url) {
  return url === 'chrome://newtab/' || url === 'edge://newtab/' || url === 'about:newtab';
}

function isRealWebTab(tab) {
  const url = tab?.url || tab?.pendingUrl || '';
  return isFavoriteUrl(url) && url !== tabOutUrl();
}

function isFavoriteUrl(url) {
  if (!url) return false;
  return !INTERNAL_URL_PREFIXES.some((prefix) => url.startsWith(prefix));
}

function badgeColor(count) {
  if (count <= 10) return '#3d7a4a';
  if (count <= 20) return '#b8892e';
  return '#b35a5a';
}

async function isEnabled(settings) {
  const current = await settings.get().catch(() => ({}));
  return current.tabOutEnabled === true;
}

function brandFromUrl(url) {
  try {
    const host = new URL(url).hostname;
    return brandFromHostname(host);
  } catch { return url; }
}
