/* ================================================================
   tab-out — Dashboard App (Pure Extension Edition)

   This file is the brain of the dashboard. Now that the dashboard
   IS the extension page (not inside an iframe), it can call
   chrome.tabs and chrome.storage directly — no postMessage bridge needed.

   What this file does:
   1. Reads open browser tabs directly via chrome.tabs.query()
   2. Groups tabs by domain with a landing pages category
   3. Renders domain cards, banners, and stats
   4. Handles all user actions (close tabs, save for later, focus tab)
   5. Stores "Saved for Later" tabs in chrome.storage.local (no server)
   ================================================================ */

'use strict';


/* No hard cap on favorites. The favorites column scrolls when content
   overflows. SLOT_UPPER_BOUND is just a defensive ceiling on slot indices
   — nobody should ever hit it, but it prevents pathological inputs from
   creating a grid with billions of empty cells. */
const SLOT_UPPER_BOUND = 10000;


/* ----------------------------------------------------------------
   I18N — String table with simple t() lookup

   Values can be strings or functions (for pluralization / interpolation).
   Add a key once in both languages. Missing keys fall back to English.
   ---------------------------------------------------------------- */
const STRINGS = {
  en: {
    favorites: 'Favorites',
    add: 'Add', save: 'Save', cancel: 'Cancel', confirmOk: 'Confirm',
    uploadLogo: 'Upload logo (or paste image)', reset: 'Reset', auto: 'Auto',
    urlLabel: 'URL', titleLabel: 'Title',
    titlePlaceholder: 'Title (optional)',
    favoritesEmpty: 'Nothing pinned yet. Click + to add a URL, or star a tab on the right.',
    addAFavorite: 'Add a favorite',
    edit: 'Edit', remove: 'Remove', moreActions: 'More',
    rightNow: 'Right now', openTabs: 'Open tabs', pinned: 'Pinned',
    nTabsCount: (n) => `${n} tab${n !== 1 ? 's' : ''}`,
    homepages: 'Homepages',
    nDomains: (n) => `${n} domain${n !== 1 ? 's' : ''}`,
    nTabsOpen: (n) => `${n} tab${n !== 1 ? 's' : ''} open`,
    dupeBadge: (n) => `duplicate x ${n}`,
    closeAllN: (n) => `Close all ${n} tab${n !== 1 ? 's' : ''}`,
    closeDupes: 'Close duplicates',
    plusN: (n) => `+${n} more`,
    statTabs: 'Open tabs',
    addToFav: 'Add to favorites', removeFromFav: 'Remove from favorites',
    pinTip: 'Pin tab', unpinTip: 'Unpin tab',
    closeThisTab: 'Close this tab',
    nWolfyTabsOpen: 'tab-home tabs open', keepOne: 'Keep one',
    addedToFavorites: 'Added to favorites', removedFromFavorites: 'Removed from favorites',
    confirmRemoveFav: 'Remove this from favorites?',
    alreadyAdded: 'Already in favorites',
    saveFailed: 'Save failed (storage may be full)',
    favoriteUpdated: 'Favorite updated', tabClosed: 'Tab closed',
    allTabsClosed: 'All tabs closed. Fresh start.',
    closedExtras: 'Closed duplicate tab-home tabs',
    closedDupes: 'Closed duplicate tabs',
    closedNFromX: (n, name) => `Closed ${n} tab${n !== 1 ? 's' : ''} from ${name}`,
    tabs: 'tabs',
    langToggle: '中',
  },
  zh: {
    favorites: '收藏',
    add: '添加', save: '保存', cancel: '取消', confirmOk: '确定',
    uploadLogo: '上传图标（或粘贴图片）', reset: '重置', auto: '自动',
    urlLabel: '网址', titleLabel: '标题',
    titlePlaceholder: '标题（可选）',
    favoritesEmpty: '还没有收藏。点击 + 添加链接，或在右侧给标签页标星。',
    addAFavorite: '添加收藏',
    edit: '编辑', remove: '删除', moreActions: '更多',
    rightNow: '正在打开', openTabs: '当前标签', pinned: '已固定',
    nTabsCount: (n) => `${n} 个标签`,
    homepages: '主页',
    nDomains: (n) => `${n} 个域名`,
    nTabsOpen: (n) => `已打开 ${n} 个`,
    dupeBadge: (n) => `重复 x ${n}`,
    closeAllN: (n) => `关闭全部 ${n} 个`,
    closeDupes: '关闭重复',
    plusN: (n) => `还有 ${n} 个`,
    statTabs: '已打开',
    addToFav: '加入收藏', removeFromFav: '移除收藏',
    pinTip: '固定此标签', unpinTip: '取消固定',
    closeThisTab: '关闭此标签',
    nWolfyTabsOpen: '个 tab-home 标签页', keepOne: '只保留一个',
    addedToFavorites: '已加入收藏', removedFromFavorites: '已从收藏移除',
    confirmRemoveFav: '确定要取消收藏此网址吗？',
    alreadyAdded: '已经收藏过了',
    saveFailed: '保存失败（存储可能已满）',
    favoriteUpdated: '收藏已更新', tabClosed: '标签已关闭',
    allTabsClosed: '所有标签已关闭。重新开始。',
    closedExtras: '已关闭重复的 tab-home',
    closedDupes: '已关闭重复的标签页',
    closedNFromX: (n, name) => `已从 ${name} 关闭 ${n} 个标签`,
    tabs: '个',
    langToggle: 'EN',
  },
};

let currentLang = 'en';

function t(key, ...args) {
  const v = (STRINGS[currentLang] && STRINGS[currentLang][key]) ?? STRINGS.en[key] ?? key;
  return typeof v === 'function' ? v(...args) : v;
}

async function loadLang() {
  try {
    const { lang } = await chrome.storage.local.get('lang');
    if (lang === 'zh' || lang === 'en') currentLang = lang;
  } catch {}
}

async function saveLang(lang) {
  if (lang !== 'zh' && lang !== 'en') return;
  currentLang = lang;
  try { await chrome.storage.local.set({ lang }); } catch {}
}


/* ----------------------------------------------------------------
   THEME — 'light' or 'dark', stored in chrome.storage.local
   ---------------------------------------------------------------- */
const ICON_SUN  = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>`;
const ICON_MOON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>`;

async function loadTheme() {
  try {
    const { theme } = await chrome.storage.local.get('theme');
    const t = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
  } catch {
    document.documentElement.dataset.theme = 'light';
  }
  paintThemeToggle();
}

function paintThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isDark = document.documentElement.dataset.theme === 'dark';
  btn.innerHTML = isDark ? ICON_SUN : ICON_MOON;
}

async function toggleTheme() {
  const cur  = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  paintThemeToggle();
  try { await chrome.storage.local.set({ theme: next }); } catch {}
}

/**
 * applyStaticI18n()
 *
 * Updates the static labels in index.html that aren't otherwise
 * rebuilt by renderStaticDashboard. Called on init and on language switch.
 */
function applyStaticI18n() {
  document.documentElement.lang = currentLang === 'zh' ? 'zh' : 'en';

  const set = (selector, key, attr = 'textContent') => {
    const el = document.querySelector(selector);
    if (!el) return;
    if (attr === 'textContent') el.textContent = t(key);
    else el.setAttribute(attr, t(key));
  };

  // Header toggle button — shows the OTHER language as a hint to click
  set('#langToggle', 'langToggle');

  // Favorites column
  set('.favorites-column .section-header h2', 'favorites');
  set('#favoritesAddToggle', 'addAFavorite', 'title');
  set('#favoritesUrlLabel', 'urlLabel');
  set('#favoritesTitleLabel', 'titleLabel');
  set('#favoritesUrlInput', 'titlePlaceholder' /*unused below for url*/, 'placeholder'); // overridden next line
  const urlInput = document.getElementById('favoritesUrlInput');
  if (urlInput) urlInput.placeholder = 'https://...';
  set('#favoritesTitleInput', 'titlePlaceholder', 'placeholder');
  set('#favoritesLogoPlaceholder', 'auto');
  set('label[for="favoritesLogoInput"]', 'uploadLogo');
  set('.favorites-logo-reset', 'reset');
  set('#favoritesFormSubmit', 'add');
  set('.favorites-form-cancel', 'cancel');
  set('#favoritesFormDelete', 'remove');
  set('#favoritesEmpty', 'favoritesEmpty');

  // Open tabs section default title (overwritten by render when tabs exist)
  set('#openTabsSectionTitle', 'rightNow');

  // Footer stat
  set('.stat-label', 'statTabs');

  // tab-out duplicate banner — only the suffix and button label
  // (the count number lives in #tabOutDupeCount and is set by JS)
  const cleanupText = document.querySelector('.tab-cleanup-text');
  if (cleanupText) {
    // Rebuild: <strong id="tabOutDupeCount">N</strong> + suffix
    const strong = document.getElementById('tabOutDupeCount');
    const suffix = currentLang === 'zh' ? ` ${t('nWolfyTabsOpen')}` : ` ${t('nWolfyTabsOpen')}`;
    cleanupText.innerHTML = '';
    if (strong) cleanupText.appendChild(strong);
    cleanupText.appendChild(document.createTextNode(suffix));
  }
  set('.tab-cleanup-btn', 'keepOne');
}


/* ----------------------------------------------------------------
   CHROME TABS — Direct API Access

   Since this page IS the extension's new tab page, it has full
   access to chrome.tabs and chrome.storage. No middleman needed.
   ---------------------------------------------------------------- */

// All open tabs — populated by fetchOpenTabs()
let openTabs = [];

/**
 * fetchOpenTabs()
 *
 * Reads all currently open browser tabs directly from Chrome.
 * Sets the extensionId flag so we can identify tab-out's own pages.
 */
async function fetchOpenTabs() {
  try {
    const extensionId = chrome.runtime.id;
    // The new URL for this page is now index.html (not newtab.html)
    const newtabUrl = `chrome-extension://${extensionId}/index.html`;

    const tabs = await chrome.tabs.query({});
    openTabs = tabs.map(t => ({
      id:           t.id,
      url:          t.url,
      title:        t.title,
      windowId:     t.windowId,
      active:       t.active,
      pinned:       !!t.pinned,
      // lastAccessed: ms timestamp of the last time this tab was activated.
      // Undefined for tabs that have never been activated this session — we
      // fall back to tab id (monotonic) so brand-new background tabs still
      // sort above old ones.
      lastAccessed: t.lastAccessed || 0,
      // Flag tab-out's own pages so we can detect duplicate new tabs
      isTabOut: t.url === newtabUrl || t.url === 'chrome://newtab/',
    }));
  } catch {
    // chrome.tabs API unavailable (shouldn't happen in an extension page)
    openTabs = [];
  }
}

/**
 * closeTabsByUrls(urls)
 *
 * Closes all open tabs whose hostname matches any of the given URLs.
 * After closing, re-fetches the tab list to keep our state accurate.
 *
 * Special case: file:// URLs are matched exactly (they have no hostname).
 */
async function closeTabsByUrls(urls) {
  if (!urls || urls.length === 0) return;

  // Separate file:// URLs (exact match) from regular URLs (hostname match)
  const targetHostnames = [];
  const exactUrls = new Set();

  for (const u of urls) {
    if (u.startsWith('file://')) {
      exactUrls.add(u);
    } else {
      try { targetHostnames.push(new URL(u).hostname); }
      catch { /* skip unparseable */ }
    }
  }

  const allTabs = await chrome.tabs.query({});
  const toClose = allTabs
    .filter(tab => {
      const tabUrl = tab.url || '';
      if (tabUrl.startsWith('file://') && exactUrls.has(tabUrl)) return true;
      try {
        const tabHostname = new URL(tabUrl).hostname;
        return tabHostname && targetHostnames.includes(tabHostname);
      } catch { return false; }
    })
    .map(tab => tab.id);

  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}

/**
 * closeTabsExact(urls)
 *
 * Closes tabs by exact URL match (not hostname). Used for landing pages
 * so closing "Gmail inbox" doesn't also close individual email threads.
 */
async function closeTabsExact(urls) {
  if (!urls || urls.length === 0) return;
  const urlSet = new Set(urls);
  const allTabs = await chrome.tabs.query({});
  const toClose = allTabs.filter(t => urlSet.has(t.url)).map(t => t.id);
  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}

/**
 * focusTab(url)
 *
 * Switches Chrome to the tab with the given URL (exact match first,
 * then hostname fallback). Also brings the window to the front.
 */
async function focusTab(url) {
  if (!url) return;
  const allTabs = await chrome.tabs.query({});
  const currentWindow = await chrome.windows.getCurrent();

  // Try exact URL match first
  let matches = allTabs.filter(t => t.url === url);

  // Fall back to hostname match
  if (matches.length === 0) {
    try {
      const targetHost = new URL(url).hostname;
      matches = allTabs.filter(t => {
        try { return new URL(t.url).hostname === targetHost; }
        catch { return false; }
      });
    } catch {}
  }

  if (matches.length === 0) return;

  // Prefer a match in a different window so it actually switches windows
  const match = matches.find(t => t.windowId !== currentWindow.id) || matches[0];
  await chrome.tabs.update(match.id, { active: true });
  await chrome.windows.update(match.windowId, { focused: true });
}

/**
 * closeDuplicateTabs(urls, keepOne)
 *
 * Closes duplicate tabs for the given list of URLs.
 * keepOne=true → keep one copy of each, close the rest.
 * keepOne=false → close all copies.
 */
async function closeDuplicateTabs(urls, keepOne = true) {
  const allTabs = await chrome.tabs.query({});
  const toClose = [];

  for (const url of urls) {
    const matching = allTabs.filter(t => t.url === url);
    if (keepOne) {
      const keep = matching.find(t => t.active) || matching[0];
      for (const tab of matching) {
        if (tab.id !== keep.id) toClose.push(tab.id);
      }
    } else {
      for (const tab of matching) toClose.push(tab.id);
    }
  }

  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}

/**
 * closeTabOutDupes()
 *
 * Closes all duplicate tab-out new-tab pages except the current one.
 */
async function closeTabOutDupes() {
  const extensionId = chrome.runtime.id;
  const newtabUrl = `chrome-extension://${extensionId}/index.html`;

  const allTabs = await chrome.tabs.query({});
  const currentWindow = await chrome.windows.getCurrent();
  const tabOutTabs = allTabs.filter(t =>
    t.url === newtabUrl || t.url === 'chrome://newtab/'
  );

  if (tabOutTabs.length <= 1) return;

  // Keep the active tab-out tab in the CURRENT window — that's the one the
  // user is looking at right now. Falls back to any active one, then the first.
  const keep =
    tabOutTabs.find(t => t.active && t.windowId === currentWindow.id) ||
    tabOutTabs.find(t => t.active) ||
    tabOutTabs[0];
  const toClose = tabOutTabs.filter(t => t.id !== keep.id).map(t => t.id);
  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}


/* ----------------------------------------------------------------
   LONG-TERM FAVORITES — chrome.storage.local

   Stored under the "favorites" key. Permanent bookmarks the user
   wants one-click access to.

   Schema:
   [
     {
       id:      "1712345678901",
       url:     "https://example.com",
       title:   "Example",
       addedAt: "2026-05-01T10:00:00.000Z",
     },
     ...
   ]
   ---------------------------------------------------------------- */

/* Favorite shape: { id, url, title, addedAt, slot, customLogo? }

   `slot` is an explicit grid index. New favorites are placed at the
   first empty slot. Deleting a card leaves a gap so the rest don't
   shift around. The visible column count can change with screen width;
   cards just reflow into different (row, col) positions while keeping
   their slot index. */

async function getFavorites() {
  const { favorites = [] } = await chrome.storage.local.get('favorites');
  return favorites
    .filter(f => f && f.type !== 'folder' && f.url)
    .map(({ type, parentId, ...rest }) => rest);
}

async function addFavorite(url, title, customLogo = null) {
  if (!url) return false;
  const favorites = await getFavorites();
  if (favorites.some(f => f.url === url)) return false;

  // Auto-derive a clean brand-style title (e.g. "Binance" from www.binance.com)
  // when no explicit title was passed.
  const cleanTitle = (title || '').trim();
  let finalTitle;
  if (cleanTitle) {
    finalTitle = cleanTitle;
  } else {
    try { finalTitle = friendlyDomain(new URL(url).hostname) || url; }
    catch { finalTitle = url; }
  }

  // Place at the first empty slot — no hard cap.
  const taken = new Set(favorites.map(f => f.slot));
  let slot = 0;
  while (taken.has(slot)) slot++;

  const fav = {
    id:      Date.now().toString(),
    url,
    title:   finalTitle,
    addedAt: new Date().toISOString(),
    slot,
  };
  if (customLogo) fav.customLogo = customLogo;
  favorites.push(fav);
  await chrome.storage.local.set({ favorites });
  return true;
}

/**
 * Set a favorite's slot. If another favorite already owns that slot,
 * swap their slots — gives users predictable "click-and-place" behaviour
 * during drag-and-drop reordering.
 */
async function setFavoriteSlot(id, newSlot) {
  if (!id || typeof newSlot !== 'number') return;
  if (newSlot < 0 || newSlot >= SLOT_UPPER_BOUND) return;
  const favorites = await getFavorites();
  const dragged = favorites.find(f => f.id === id);
  if (!dragged) return;
  if (dragged.slot === newSlot) return;
  const occupant = favorites.find(f => f.slot === newSlot);
  if (occupant) occupant.slot = dragged.slot;
  dragged.slot = newSlot;
  await chrome.storage.local.set({ favorites });
}

/**
 * One-time migration:
 *  - Strip legacy folder entries / parentId / type fields.
 *  - Ensure every favorite has a non-negative slot. Slots that collide
 *    are reassigned to the first free slot. No upper bound — favorites
 *    are unlimited.
 * Idempotent.
 */
async function migrateAwayFromFolders() {
  const { favorites: raw = [] } = await chrome.storage.local.get('favorites');
  if (!raw.length) return;

  const before = JSON.stringify(raw);

  const cleaned = raw
    .filter(f => f && f.type !== 'folder' && f.url)
    .map(({ type, parentId, ...rest }) => rest);

  // Keep entries with valid non-conflicting slots; everything else gets a fresh one.
  const taken = new Set();
  const needSlot = [];
  for (const f of cleaned) {
    const valid = typeof f.slot === 'number' && f.slot >= 0 && !taken.has(f.slot);
    if (valid) taken.add(f.slot);
    else       needSlot.push(f);
  }

  // Place the rest into vacant slots, in their original order.
  let next = 0;
  for (const f of needSlot) {
    while (taken.has(next)) next++;
    f.slot = next;
    taken.add(next);
  }

  const final = cleaned;

  if (JSON.stringify(final) !== before) {
    await chrome.storage.local.set({ favorites: final });
  }
}

/**
 * updateFavorite(id, fields)
 *
 * Patches a favorite by id. Pass `customLogo: null` to delete the
 * custom logo and revert to the auto-fetched favicon.
 */
async function updateFavorite(id, fields) {
  const favorites = await getFavorites();
  const fav = favorites.find(f => f.id === id);
  if (!fav) return;
  for (const [k, v] of Object.entries(fields)) {
    if (k === 'customLogo' && v === null) delete fav.customLogo;
    else fav[k] = v;
  }
  await chrome.storage.local.set({ favorites });
}

async function removeFavorite(id) {
  const favorites = await getFavorites();
  const next = favorites.filter(f => f.id !== id);
  await chrome.storage.local.set({ favorites: next });
}

async function isFavorited(url) {
  const favorites = await getFavorites();
  return favorites.some(f => f.url === url);
}

/* ----------------------------------------------------------------
   UI HELPERS
   ---------------------------------------------------------------- */

/**
 * playCloseSound()
 *
 * Plays a clean "swoosh" sound when tabs are closed.
 * Built entirely with the Web Audio API — no sound files needed.
 * A filtered noise sweep that descends in pitch, like air moving.
 */
function playCloseSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime;

    // Swoosh: shaped white noise through a sweeping bandpass filter
    const duration = 0.25;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate noise with a natural envelope (quick attack, smooth decay)
    for (let i = 0; i < data.length; i++) {
      const pos = i / data.length;
      // Envelope: ramps up fast in first 10%, then fades out smoothly
      const env = pos < 0.1 ? pos / 0.1 : Math.pow(1 - (pos - 0.1) / 0.9, 1.5);
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Bandpass filter sweeps from high to low — creates the "swoosh" character
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.0;
    filter.frequency.setValueAtTime(4000, t);
    filter.frequency.exponentialRampToValueAtTime(400, t + duration);

    // Volume
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(t);

    setTimeout(() => ctx.close(), 500);
  } catch {
    // Audio not supported — fail silently
  }
}

/**
 * shootConfetti(x, y)
 *
 * Shoots a burst of colorful confetti particles from the given screen
 * coordinates (typically the center of a card being closed).
 * Pure CSS + JS, no libraries.
 */
function shootConfetti(x, y) {
  const colors = [
    '#c8713a', // amber
    '#e8a070', // amber light
    '#5a7a62', // sage
    '#8aaa92', // sage light
    '#5a6b7a', // slate
    '#8a9baa', // slate light
    '#d4b896', // warm paper
    '#b35a5a', // rose
  ];

  const particleCount = 17;

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement('div');

    const isCircle = Math.random() > 0.5;
    const size = 5 + Math.random() * 6; // 5–11px
    const color = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${isCircle ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      opacity: 1;
    `;
    document.body.appendChild(el);

    // Physics: random angle and speed for the outward burst
    const angle   = Math.random() * Math.PI * 2;
    const speed   = 60 + Math.random() * 120;
    const vx      = Math.cos(angle) * speed;
    const vy      = Math.sin(angle) * speed - 80; // bias upward
    const gravity = 200;

    const startTime = performance.now();
    const duration  = 700 + Math.random() * 200; // 700–900ms

    function frame(now) {
      const elapsed  = (now - startTime) / 1000;
      const progress = elapsed / (duration / 1000);

      if (progress >= 1) { el.remove(); return; }

      const px = vx * elapsed;
      const py = vy * elapsed + 0.5 * gravity * elapsed * elapsed;
      const opacity = progress < 0.5 ? 1 : 1 - (progress - 0.5) * 2;
      const rotate  = elapsed * 200 * (isCircle ? 0 : 1);

      el.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) rotate(${rotate}deg)`;
      el.style.opacity = opacity;

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }
}

/**
 * animateCardOut(card)
 *
 * Smoothly removes a mission card: fade + scale down, then confetti.
 * After the animation, checks if the grid is now empty.
 */
function animateCardOut(card) {
  if (!card) return;

  const rect = card.getBoundingClientRect();
  shootConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

  card.classList.add('closing');
  setTimeout(() => {
    card.remove();
    checkAndShowEmptyState();
  }, 300);
}

/**
 * showToast(message)
 *
 * Brief pop-up notification at the bottom of the screen.
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toastText').textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2500);
}

/**
 * checkAndShowEmptyState()
 *
 * Shows a cheerful "Inbox zero" message when all domain cards are gone.
 */
function checkAndShowEmptyState() {
  const missionsEl = document.getElementById('openTabsMissions');
  if (!missionsEl) return;

  const remaining = missionsEl.querySelectorAll('.mission-card:not(.closing)').length;
  if (remaining > 0) return;

  missionsEl.innerHTML = `
    <div class="missions-empty-state">
      <div class="empty-checkmark">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <div class="empty-title">Inbox zero, but for tabs.</div>
      <div class="empty-subtitle">You're free.</div>
    </div>
  `;

  const countEl = document.getElementById('openTabsSectionCount');
  if (countEl) countEl.textContent = '0 domains';
}

/**
 * timeAgo(dateStr)
 *
 * Converts an ISO date string into a human-friendly relative time.
 * "2026-04-04T10:00:00Z" → "2 hrs ago" or "yesterday"
 */
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const then = new Date(dateStr);
  const now  = new Date();
  const diffMins  = Math.floor((now - then) / 60000);
  const diffHours = Math.floor((now - then) / 3600000);
  const diffDays  = Math.floor((now - then) / 86400000);

  if (diffMins < 1)   return 'just now';
  if (diffMins < 60)  return diffMins + ' min ago';
  if (diffHours < 24) return diffHours + ' hr' + (diffHours !== 1 ? 's' : '') + ' ago';
  if (diffDays === 1) return 'yesterday';
  return diffDays + ' days ago';
}

/**
 * getDateDisplay() — weekday + DD/MM/YYYY, e.g. "Sunday · 03/05/2026"
 * Weekday name follows the current language setting.
 */
function getDateDisplay() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const date = `${dd}/${mm}/${d.getFullYear()}`;
  const locale = currentLang === 'zh' ? 'zh-CN' : 'en-US';
  let weekday = '';
  try {
    weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(d);
  } catch {}
  return weekday ? `${weekday} · ${date}` : date;
}


/* ----------------------------------------------------------------
   DOMAIN & TITLE CLEANUP HELPERS
   ---------------------------------------------------------------- */

// Map of known hostnames → friendly display names.
const FRIENDLY_DOMAINS = {
  'github.com':           'GitHub',
  'www.github.com':       'GitHub',
  'gist.github.com':      'GitHub Gist',
  'youtube.com':          'YouTube',
  'www.youtube.com':      'YouTube',
  'music.youtube.com':    'YouTube Music',
  'x.com':                'X',
  'www.x.com':            'X',
  'twitter.com':          'X',
  'www.twitter.com':      'X',
  'reddit.com':           'Reddit',
  'www.reddit.com':       'Reddit',
  'old.reddit.com':       'Reddit',
  'substack.com':         'Substack',
  'www.substack.com':     'Substack',
  'medium.com':           'Medium',
  'www.medium.com':       'Medium',
  'linkedin.com':         'LinkedIn',
  'www.linkedin.com':     'LinkedIn',
  'stackoverflow.com':    'Stack Overflow',
  'www.stackoverflow.com':'Stack Overflow',
  'news.ycombinator.com': 'Hacker News',
  'google.com':           'Google',
  'www.google.com':       'Google',
  'mail.google.com':      'Gmail',
  'docs.google.com':      'Google Docs',
  'drive.google.com':     'Google Drive',
  'calendar.google.com':  'Google Calendar',
  'meet.google.com':      'Google Meet',
  'gemini.google.com':    'Gemini',
  'chatgpt.com':          'ChatGPT',
  'www.chatgpt.com':      'ChatGPT',
  'chat.openai.com':      'ChatGPT',
  'claude.ai':            'Claude',
  'www.claude.ai':        'Claude',
  'code.claude.com':      'Claude Code',
  'notion.so':            'Notion',
  'www.notion.so':        'Notion',
  'figma.com':            'Figma',
  'www.figma.com':        'Figma',
  'slack.com':            'Slack',
  'app.slack.com':        'Slack',
  'discord.com':          'Discord',
  'www.discord.com':      'Discord',
  'wikipedia.org':        'Wikipedia',
  'en.wikipedia.org':     'Wikipedia',
  'amazon.com':           'Amazon',
  'www.amazon.com':       'Amazon',
  'netflix.com':          'Netflix',
  'www.netflix.com':      'Netflix',
  'spotify.com':          'Spotify',
  'open.spotify.com':     'Spotify',
  'vercel.com':           'Vercel',
  'www.vercel.com':       'Vercel',
  'npmjs.com':            'npm',
  'www.npmjs.com':        'npm',
  'developer.mozilla.org':'MDN',
  'arxiv.org':            'arXiv',
  'www.arxiv.org':        'arXiv',
  'huggingface.co':       'Hugging Face',
  'www.huggingface.co':   'Hugging Face',
  'producthunt.com':      'Product Hunt',
  'www.producthunt.com':  'Product Hunt',
  'xiaohongshu.com':      'RedNote',
  'www.xiaohongshu.com':  'RedNote',
  'local-files':          'Local Files',
};

function friendlyDomain(hostname) {
  if (!hostname) return '';
  if (FRIENDLY_DOMAINS[hostname]) return FRIENDLY_DOMAINS[hostname];

  if (hostname.endsWith('.substack.com') && hostname !== 'substack.com') {
    return capitalize(hostname.replace('.substack.com', '')) + "'s Substack";
  }
  if (hostname.endsWith('.github.io')) {
    return capitalize(hostname.replace('.github.io', '')) + ' (GitHub Pages)';
  }

  // Strip leading www., then return just the second-level domain (the
  // "brand"). For www.binance.com → "Binance". For accounts.binance.com →
  // also "Binance". Two-segment TLDs (.co.uk etc.) are handled too.
  const TLDS_2 = ['co.uk', 'co.jp', 'com.cn', 'com.tw', 'com.au', 'com.hk', 'co.kr'];
  const parts = hostname.replace(/^www\./, '').split('.');
  let brand;
  if (parts.length >= 3 && TLDS_2.includes(parts.slice(-2).join('.'))) {
    brand = parts[parts.length - 3];
  } else if (parts.length >= 2) {
    brand = parts[parts.length - 2];
  } else {
    brand = parts[0];
  }
  return capitalize(brand);
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function stripTitleNoise(title) {
  if (!title) return '';
  // Strip leading notification count: "(2) Title"
  title = title.replace(/^\(\d+\+?\)\s*/, '');
  // Strip inline counts like "Inbox (16,359)"
  title = title.replace(/\s*\([\d,]+\+?\)\s*/g, ' ');
  // Strip email addresses (privacy + cleaner display)
  title = title.replace(/\s*[\-\u2010-\u2015]\s*[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, '');
  title = title.replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, '');
  // Clean X/Twitter format
  title = title.replace(/\s+on X:\s*/, ': ');
  title = title.replace(/\s*\/\s*X\s*$/, '');
  return title.trim();
}

function cleanTitle(title, hostname) {
  if (!title || !hostname) return title || '';

  const friendly = friendlyDomain(hostname);
  const domain   = hostname.replace(/^www\./, '');
  const seps     = [' - ', ' | ', ' — ', ' · ', ' – '];

  for (const sep of seps) {
    const idx = title.lastIndexOf(sep);
    if (idx === -1) continue;
    const suffix     = title.slice(idx + sep.length).trim();
    const suffixLow  = suffix.toLowerCase();
    if (
      suffixLow === domain.toLowerCase() ||
      suffixLow === friendly.toLowerCase() ||
      suffixLow === domain.replace(/\.\w+$/, '').toLowerCase() ||
      domain.toLowerCase().includes(suffixLow) ||
      friendly.toLowerCase().includes(suffixLow)
    ) {
      const cleaned = title.slice(0, idx).trim();
      if (cleaned.length >= 5) return cleaned;
    }
  }
  return title;
}

function smartTitle(title, url) {
  if (!url) return title || '';
  let pathname = '', hostname = '';
  try { const u = new URL(url); pathname = u.pathname; hostname = u.hostname; }
  catch { return title || ''; }

  const titleIsUrl = !title || title === url || title.startsWith(hostname) || title.startsWith('http');

  if ((hostname === 'x.com' || hostname === 'twitter.com' || hostname === 'www.x.com') && pathname.includes('/status/')) {
    const username = pathname.split('/')[1];
    if (username) return titleIsUrl ? `Post by @${username}` : title;
  }

  if (hostname === 'github.com' || hostname === 'www.github.com') {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const [owner, repo, ...rest] = parts;
      if (rest[0] === 'issues' && rest[1]) return `${owner}/${repo} Issue #${rest[1]}`;
      if (rest[0] === 'pull'   && rest[1]) return `${owner}/${repo} PR #${rest[1]}`;
      if (rest[0] === 'blob' || rest[0] === 'tree') return `${owner}/${repo} — ${rest.slice(2).join('/')}`;
      if (titleIsUrl) return `${owner}/${repo}`;
    }
  }

  if ((hostname === 'www.youtube.com' || hostname === 'youtube.com') && pathname === '/watch') {
    if (titleIsUrl) return 'YouTube Video';
  }

  if ((hostname === 'www.reddit.com' || hostname === 'reddit.com' || hostname === 'old.reddit.com') && pathname.includes('/comments/')) {
    const parts  = pathname.split('/').filter(Boolean);
    const subIdx = parts.indexOf('r');
    if (subIdx !== -1 && parts[subIdx + 1]) {
      if (titleIsUrl) return `r/${parts[subIdx + 1]} post`;
    }
  }

  return title || url;
}


/* ----------------------------------------------------------------
   FAVICON URL — prefers Chrome's cached favicon (most accurate for sites
   the user has visited), which works for sites Google's S2 service can't
   resolve (e.g. WhatsApp Web). Requires the "favicon" permission.
   ---------------------------------------------------------------- */
function getFaviconUrl(pageUrl, size = 64) {
  if (!pageUrl) return '';
  try {
    const u = new URL(chrome.runtime.getURL('/_favicon/'));
    u.searchParams.set('pageUrl', pageUrl);
    u.searchParams.set('size', String(size));
    return u.toString();
  } catch {
    return '';
  }
}

/**
 * High-quality favicon fallback chain.
 *  1. apple-touch-icon.png            — typically 180–512px, beautiful
 *  2. apple-touch-icon-precomposed.png — older convention, same idea
 *  3. Chrome's cached _favicon (real icon, but lower-res)
 *
 * Used as a list passed via data-fallback="…|…|…" — when the <img> errors
 * out (404, transparent, etc.), the global error handler advances to the
 * next URL in the list.
 */
function getFaviconFallbackChain(pageUrl, size = 128) {
  if (!pageUrl) return [];
  let origin = '';
  try { origin = new URL(pageUrl).origin; } catch { return []; }
  return [
    `${origin}/apple-touch-icon.png`,
    `${origin}/apple-touch-icon-precomposed.png`,
    getFaviconUrl(pageUrl, size),
  ].filter(Boolean);
}

// Global error-handler: when an <img class="favorite-favicon"> 404s, walk
// the fallback chain stored in data-fallback. Capture phase because `error`
// events don't bubble.
document.addEventListener('error', (e) => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement)) return;
  if (!img.dataset || typeof img.dataset.fallback !== 'string') return;
  const list = img.dataset.fallback.split('|').filter(Boolean);
  if (list.length === 0) {
    img.style.display = 'none';
    return;
  }
  const next = list.shift();
  img.dataset.fallback = list.join('|');
  img.src = next;
}, true);

/* ----------------------------------------------------------------
   ICON RESOLUTION CACHE — once an image loads successfully, persist
   the URL that worked into the favorite's `iconUrl` field. Future
   renders skip the fallback chain entirely.
   ---------------------------------------------------------------- */
let _pendingIconWrites = new Map();   // favId → resolved url
let _iconWriteTimer    = null;
let _suppressFavReRender = false;     // set briefly so onChanged skips us

async function flushIconWrites() {
  _iconWriteTimer = null;
  const writes = _pendingIconWrites;
  if (writes.size === 0) return;
  _pendingIconWrites = new Map();
  const { favorites = [] } = await chrome.storage.local.get('favorites');
  let modified = false;
  for (const [favId, url] of writes) {
    const fav = favorites.find(f => f.id === favId);
    if (fav && fav.iconUrl !== url) {
      fav.iconUrl = url;
      modified = true;
    }
  }
  if (!modified) return;
  _suppressFavReRender = true;
  await chrome.storage.local.set({ favorites });
  setTimeout(() => { _suppressFavReRender = false; }, 200);
}

function queueIconWrite(favId, url) {
  if (!favId || !url) return;
  _pendingIconWrites.set(favId, url);
  if (_iconWriteTimer) clearTimeout(_iconWriteTimer);
  _iconWriteTimer = setTimeout(flushIconWrites, 500);
}

// Capture phase — `load` doesn't bubble for individual images.
document.addEventListener('load', (e) => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement)) return;
  if (!img.classList.contains('favorite-favicon')) return;
  const favId = img.dataset.favId;
  if (!favId) return;
  if (img.dataset.resolved === '1') return;   // already cached
  const finalUrl = img.currentSrc || img.src;
  if (!finalUrl) return;
  // Don't re-cache an already-stored data URL.
  if (finalUrl.startsWith('data:')) return;
  img.dataset.resolved = '1';
  // Download the image bytes and persist as a base64 data URL — zero
  // network on subsequent renders.
  downloadAndCacheIcon(favId, finalUrl);
}, true);

const MAX_ICON_BYTES = 200 * 1024;   // hard cap to keep storage reasonable

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload  = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

async function downloadAndCacheIcon(favId, url) {
  try {
    const r = await fetch(url, { credentials: 'omit' });
    if (!r.ok) return;
    const blob = await r.blob();
    if (blob.size === 0 || blob.size > MAX_ICON_BYTES) return;
    const dataUrl = await blobToDataUrl(blob);
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return;
    queueIconWrite(favId, dataUrl);
  } catch {
    // Fetch failed (network, blocked, etc.) — leave iconUrl unset; we'll
    // try again next render via the fallback chain.
  }
}


/* ----------------------------------------------------------------
   SVG ICON STRINGS
   ---------------------------------------------------------------- */
const ICONS = {
  tabs:    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18" /></svg>`,
  close:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`,
  archive: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>`,
  focus:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" /></svg>`,
};


/* ----------------------------------------------------------------
   IN-MEMORY STORE FOR OPEN-TAB GROUPS
   ---------------------------------------------------------------- */
let domainGroups       = [];   // regular open-tabs groups
let pinnedDomainGroups = [];   // pinned-tabs groups (rendered above)


/* ----------------------------------------------------------------
   HELPER: filter out browser-internal pages
   ---------------------------------------------------------------- */

/**
 * getRealTabs()
 *
 * Returns tabs that are real web pages — no chrome://, extension
 * pages, about:blank, etc.
 */
function getRealTabs() {
  return openTabs.filter(t => {
    const url = t.url || '';
    return (
      !url.startsWith('chrome://') &&
      !url.startsWith('chrome-extension://') &&
      !url.startsWith('about:') &&
      !url.startsWith('edge://') &&
      !url.startsWith('brave://')
    );
  });
}

/**
 * checkTabOutDupes()
 *
 * Counts how many tab-out pages are open. If more than 1,
 * shows a banner offering to close the extras.
 */
function checkTabOutDupes() {
  const tabOutTabs = openTabs.filter(t => t.isTabOut);
  const banner  = document.getElementById('tabOutDupeBanner');
  const countEl = document.getElementById('tabOutDupeCount');
  if (!banner) return;

  if (tabOutTabs.length > 1) {
    if (countEl) countEl.textContent = tabOutTabs.length;
    banner.style.display = 'inline-flex';
  } else {
    banner.style.display = 'none';
  }
}


/* ----------------------------------------------------------------
   OVERFLOW CHIPS ("+N more" expand button in domain cards)
   ---------------------------------------------------------------- */

function buildOverflowChips(hiddenTabs, urlCounts = {}, favoritedUrls = new Set()) {
  const hiddenChips = hiddenTabs.map(tab => {
    const label     = cleanTitle(smartTitle(stripTitleNoise(tab.title || ''), tab.url), '');
    const count     = urlCounts[tab.url] || 1;
    const safeUrl   = (tab.url || '').replace(/"/g, '&quot;');
    const safeTitle = label.replace(/"/g, '&quot;');
    const dupeTag   = count > 1
      ? ` <button class="chip-dupe-badge" data-action="dedup-this-url" data-tab-url="${safeUrl}" title="${t('closeDupes')}"><span class="dupe-count">${t('dupeBadge', count)}</span><span class="dupe-action">${t('closeDupes')}</span></button>`
      : '';
    const chipClass = count > 1 ? ' chip-has-dupes' : '';
    const isFav     = favoritedUrls.has(tab.url);
    const isPinned  = !!tab.pinned;
    const faviconUrl = getFaviconUrl(tab.url, 32);
    return `<div class="page-chip clickable${chipClass}" data-action="focus-tab" data-tab-url="${safeUrl}" data-tab-id="${tab.id}" title="${safeTitle}">
      ${faviconUrl ? `<img class="chip-favicon" src="${faviconUrl}" alt="" onerror="this.style.display='none'">` : ''}
      <span class="chip-text">${label}</span>${dupeTag}
      <div class="chip-actions">
        <button class="chip-action chip-star${isFav ? ' active' : ''}" data-action="favorite-tab" data-tab-url="${safeUrl}" data-tab-title="${safeTitle}" title="${isFav ? t('removeFromFav') : t('addToFav')}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
        </button>
        <button class="chip-action chip-pin${isPinned ? ' active' : ''}" data-action="pin-tab" data-tab-url="${safeUrl}" data-tab-id="${tab.id}" title="${isPinned ? t('unpinTip') : t('pinTip')}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
        </button>
<button class="chip-action chip-close" data-action="close-single-tab" data-tab-url="${safeUrl}" data-tab-id="${tab.id}" title="${t('closeThisTab')}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>`;
  }).join('');

  return `
    <div class="page-chips-overflow" style="display:none">${hiddenChips}</div>
    <div class="page-chip page-chip-overflow clickable" data-action="expand-chips">
      <span class="chip-text">${t('plusN', hiddenTabs.length)}</span>
    </div>`;
}


/* ----------------------------------------------------------------
   DOMAIN CARD RENDERER
   ---------------------------------------------------------------- */

/**
 * renderDomainCard(group, groupIndex)
 *
 * Builds the HTML for one domain group card.
 * group = { domain: string, tabs: [{ url, title, id, windowId, active }] }
 */
function renderDomainCard(group, favoritedUrls = new Set()) {
  const tabs      = group.tabs || [];
  const tabCount  = tabs.length;
  const isLanding = group.domain === '__landing-pages__';
  const stableId  = 'domain-' + group.domain.replace(/[^a-z0-9]/g, '-');

  // Count duplicates (exact URL match)
  const urlCounts = {};
  for (const tab of tabs) urlCounts[tab.url] = (urlCounts[tab.url] || 0) + 1;
  const dupeUrls   = Object.entries(urlCounts).filter(([, c]) => c > 1);
  const hasDupes   = dupeUrls.length > 0;
  const totalExtras = dupeUrls.reduce((s, [, c]) => s + c - 1, 0);

  const tabBadge = `<span class="open-tabs-badge">
    ${ICONS.tabs}
    ${tabCount}
  </span>`;

  // Deduplicate for display: show each URL once, with (Nx) badge if duped
  const seen = new Set();
  const uniqueTabs = [];
  for (const tab of tabs) {
    if (!seen.has(tab.url)) { seen.add(tab.url); uniqueTabs.push(tab); }
  }

  const visibleTabs = uniqueTabs.slice(0, 8);
  const extraCount  = uniqueTabs.length - visibleTabs.length;

  const pageChips = visibleTabs.map(tab => {
    let label = cleanTitle(smartTitle(stripTitleNoise(tab.title || ''), tab.url), group.domain);
    // For localhost tabs, prepend port number so you can tell projects apart
    try {
      const parsed = new URL(tab.url);
      if (parsed.hostname === 'localhost' && parsed.port) label = `${parsed.port} ${label}`;
    } catch {}
    const count     = urlCounts[tab.url];
    const safeUrl   = (tab.url || '').replace(/"/g, '&quot;');
    const safeTitle = label.replace(/"/g, '&quot;');
    const dupeTag   = count > 1
      ? ` <button class="chip-dupe-badge" data-action="dedup-this-url" data-tab-url="${safeUrl}" title="${t('closeDupes')}"><span class="dupe-count">${t('dupeBadge', count)}</span><span class="dupe-action">${t('closeDupes')}</span></button>`
      : '';
    const chipClass = count > 1 ? ' chip-has-dupes' : '';
    const isFav     = favoritedUrls.has(tab.url);
    const isPinned  = !!tab.pinned;
    const faviconUrl = getFaviconUrl(tab.url, 32);
    return `<div class="page-chip clickable${chipClass}" data-action="focus-tab" data-tab-url="${safeUrl}" data-tab-id="${tab.id}" title="${safeTitle}">
      ${faviconUrl ? `<img class="chip-favicon" src="${faviconUrl}" alt="" onerror="this.style.display='none'">` : ''}
      <span class="chip-text">${label}</span>${dupeTag}
      <div class="chip-actions">
        <button class="chip-action chip-star${isFav ? ' active' : ''}" data-action="favorite-tab" data-tab-url="${safeUrl}" data-tab-title="${safeTitle}" title="${isFav ? t('removeFromFav') : t('addToFav')}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
        </button>
        <button class="chip-action chip-pin${isPinned ? ' active' : ''}" data-action="pin-tab" data-tab-url="${safeUrl}" data-tab-id="${tab.id}" title="${isPinned ? t('unpinTip') : t('pinTip')}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
        </button>
<button class="chip-action chip-close" data-action="close-single-tab" data-tab-url="${safeUrl}" data-tab-id="${tab.id}" title="${t('closeThisTab')}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>`;
  }).join('') + (extraCount > 0 ? buildOverflowChips(uniqueTabs.slice(8), urlCounts, favoritedUrls) : '');

  // Close-all icon-only button at the top-right of the card. Tooltip carries the label.
  const closeAllBtn = `
    <button class="action-btn close-tabs mission-close-all" data-action="close-domain-tabs" data-domain-id="${stableId}" title="${t('closeAllN', tabCount)}">
      ${ICONS.close}
    </button>`;

  return `
    <div class="mission-card domain-card ${hasDupes ? 'has-amber-bar' : 'has-neutral-bar'}" data-domain-id="${stableId}">
      <div class="status-bar"></div>
      <div class="mission-content">
        <div class="mission-top">
          <span class="mission-name">${isLanding ? t('homepages') : (group.label || friendlyDomain(group.domain))}</span>
          ${tabBadge}
          ${closeAllBtn}
        </div>
        <div class="mission-pages">${pageChips}</div>
      </div>
      <div class="mission-meta">
        <div class="mission-page-count">${tabCount}</div>
        <div class="mission-page-label">${t('tabs')}</div>
      </div>
    </div>`;
}


/* ----------------------------------------------------------------
   LONG-TERM FAVORITES — Render Column
   ---------------------------------------------------------------- */

async function renderFavoritesColumn() {
  const list  = document.getElementById('favoritesList');
  const empty = document.getElementById('favoritesEmpty');
  if (!list || !empty) return;

  try {
    const items = await getFavorites();
    if (items.length === 0) {
      list.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    // Render slots from 0 up to maxSlot + a trailing buffer of empty cells
    // (so users always have somewhere to drop when reordering near the end).
    const bySlot = new Map();
    let maxSlot = -1;
    for (const it of items) {
      const s = it.slot ?? 0;
      bySlot.set(s, it);
      if (s > maxSlot) maxSlot = s;
    }
    const TRAILING_EMPTY_BUFFER = 9;   // ~one extra row of drop targets
    const totalSlots = maxSlot + 1 + TRAILING_EMPTY_BUFFER;

    let html = '';
    for (let i = 0; i < totalSlots; i++) {
      const item = bySlot.get(i);
      html += item
        ? renderFavoriteItem(item)
        : `<div class="favorite-slot-empty" data-slot="${i}"></div>`;
    }
    list.innerHTML = html;
  } catch (err) {
    console.warn('[wolfy] Could not load favorites:', err);
  }
}

function renderFavoriteItem(fav) {
  const safeUrl   = (fav.url || '').replace(/"/g, '&quot;');
  const safeTitle = (fav.title || fav.url || '').replace(/"/g, '&quot;');

  let imgHtml = '';
  if (fav.customLogo) {
    imgHtml = `<img class="favorite-favicon" src="${fav.customLogo}" alt="">`;
  } else if (fav.iconUrl) {
    // Already resolved. Data URLs are real binary caches — mark resolved so
    // we never re-download. Plain URL strings (legacy) get rendered but left
    // unresolved, so the load handler downloads + upgrades to a data URL.
    const safe       = fav.iconUrl.replace(/"/g, '&quot;');
    const isBinary   = fav.iconUrl.startsWith('data:');
    const resolved   = isBinary ? 'data-resolved="1"' : '';
    imgHtml = `<img class="favorite-favicon" src="${safe}" data-fav-id="${fav.id}" ${resolved} alt="">`;
  } else {
    const chain = getFaviconFallbackChain(fav.url, 128);
    if (chain.length > 0) {
      const primary  = chain[0].replace(/"/g, '&quot;');
      const fallback = chain.slice(1).join('|').replace(/"/g, '&quot;');
      imgHtml = `<img class="favorite-favicon" src="${primary}" data-fallback="${fallback}" data-fav-id="${fav.id}" alt="">`;
    }
  }

  return `
    <a class="favorite-item" href="${safeUrl}" draggable="true" data-fav-id="${fav.id}" title="${safeUrl}">
      ${imgHtml}
      <span class="favorite-title">${safeTitle}</span>
      <button class="favorite-menu" data-action="favorite-menu" data-fav-id="${fav.id}" title="${t('moreActions')}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
      </button>
    </a>`;
}


/* ----------------------------------------------------------------
   MAIN DASHBOARD RENDERER
   ---------------------------------------------------------------- */

/**
 * renderStaticDashboard()
 *
 * The main render function:
 * 1. Paints greeting + date
 * 2. Fetches open tabs via chrome.tabs.query()
 * 3. Groups tabs by domain (with landing pages pulled out to their own group)
 * 4. Renders domain cards
 * 5. Updates footer stats
 * 6. Renders the "Saved for Later" checklist
 */
async function renderStaticDashboard() {
  // --- Header ---
  const dateEl = document.getElementById('dateDisplay');
  if (dateEl) dateEl.textContent = getDateDisplay();

  // --- Fetch tabs ---
  await fetchOpenTabs();
  const realTabs = getRealTabs();

  // --- Group tabs by domain ---
  // Tabs are grouped purely by hostname. The original tab-out had a special
  // "Homepages" group that pulled out x.com/home, gmail inbox, etc. — but
  // splitting x.com tabs across two groups (Homepages + X) was confusing.
  // Users can re-enable per-site landing-page splits via config.local.js
  // (LOCAL_LANDING_PAGE_PATTERNS) if they want the old behavior.
  const LANDING_PAGE_PATTERNS = [
    ...(typeof LOCAL_LANDING_PAGE_PATTERNS !== 'undefined' ? LOCAL_LANDING_PAGE_PATTERNS : []),
  ];

  function isLandingPage(url) {
    try {
      const parsed = new URL(url);
      return LANDING_PAGE_PATTERNS.some(p => {
        // Support both exact hostname and suffix matching (for wildcard subdomains)
        const hostnameMatch = p.hostname
          ? parsed.hostname === p.hostname
          : p.hostnameEndsWith
            ? parsed.hostname.endsWith(p.hostnameEndsWith)
            : false;
        if (!hostnameMatch) return false;
        if (p.test)       return p.test(parsed.pathname, url);
        if (p.pathPrefix) return parsed.pathname.startsWith(p.pathPrefix);
        if (p.pathExact)  return p.pathExact.includes(parsed.pathname);
        return parsed.pathname === '/';
      });
    } catch { return false; }
  }

  // Custom group rules from config.local.js (if any)
  const customGroups = typeof LOCAL_CUSTOM_GROUPS !== 'undefined' ? LOCAL_CUSTOM_GROUPS : [];

  function matchCustomGroup(url) {
    try {
      const parsed = new URL(url);
      return customGroups.find(r => {
        const hostMatch = r.hostname
          ? parsed.hostname === r.hostname
          : r.hostnameEndsWith
            ? parsed.hostname.endsWith(r.hostnameEndsWith)
            : false;
        if (!hostMatch) return false;
        if (r.pathPrefix) return parsed.pathname.startsWith(r.pathPrefix);
        return true;
      }) || null;
    } catch { return null; }
  }

  const landingHostnames = new Set(LANDING_PAGE_PATTERNS.map(p => p.hostname).filter(Boolean));
  const landingSuffixes  = LANDING_PAGE_PATTERNS.map(p => p.hostnameEndsWith).filter(Boolean);
  function isLandingDomain(domain) {
    if (landingHostnames.has(domain)) return true;
    return landingSuffixes.some(s => domain.endsWith(s));
  }

  /**
   * Group an array of tabs into domain cards. Same logic as before, just
   * factored out so we can run it twice — once for pinned tabs, once for
   * the rest — and render each set into its own sub-section.
   */
  function groupTabsByDomain(tabs) {
    const groupMap = {};
    const landing  = [];
    for (const tab of tabs) {
      try {
        if (isLandingPage(tab.url)) { landing.push(tab); continue; }
        const customRule = matchCustomGroup(tab.url);
        if (customRule) {
          const key = customRule.groupKey;
          if (!groupMap[key]) groupMap[key] = { domain: key, label: customRule.groupLabel, tabs: [] };
          groupMap[key].tabs.push(tab);
          continue;
        }
        const hostname = (tab.url && tab.url.startsWith('file://'))
          ? 'local-files'
          : new URL(tab.url).hostname;
        if (!hostname) continue;
        if (!groupMap[hostname]) groupMap[hostname] = { domain: hostname, tabs: [] };
        groupMap[hostname].tabs.push(tab);
      } catch { /* skip malformed */ }
    }
    if (landing.length > 0) {
      groupMap['__landing-pages__'] = { domain: '__landing-pages__', tabs: landing };
    }

    // Sort tabs WITHIN each group: most recently active first, then newer
    // tab ids (a fresh tab might have lastAccessed=0 but a higher id than
    // older tabs).
    const tabRecency = (t) => (t.lastAccessed || 0);
    for (const g of Object.values(groupMap)) {
      g.tabs.sort((a, b) => {
        const t = tabRecency(b) - tabRecency(a);
        return t !== 0 ? t : (b.id - a.id);
      });
    }

    return Object.values(groupMap).sort((a, b) => {
      // Landing pages still float to the top (no-op when LANDING_PAGE_PATTERNS is empty)
      const aIsLanding = a.domain === '__landing-pages__';
      const bIsLanding = b.domain === '__landing-pages__';
      if (aIsLanding !== bIsLanding) return aIsLanding ? -1 : 1;

      // Primary: group with the most recently active tab comes first.
      // Because tabs inside each group are already sorted by recency,
      // tabs[0] holds the freshest one.
      const aTime = a.tabs[0] ? tabRecency(a.tabs[0]) : 0;
      const bTime = b.tabs[0] ? tabRecency(b.tabs[0]) : 0;
      if (aTime !== bTime) return bTime - aTime;

      // Tie-break: highest tab id first — handles brand-new background
      // tabs that haven't been activated yet but should still appear at the top.
      const aMaxId = a.tabs[0] ? a.tabs[0].id : 0;
      const bMaxId = b.tabs[0] ? b.tabs[0].id : 0;
      return bMaxId - aMaxId;
    });
  }

  // Split tabs into pinned + regular and group each subset separately.
  const pinnedRealTabs  = realTabs.filter(t => t.pinned);
  const regularRealTabs = realTabs.filter(t => !t.pinned);
  pinnedDomainGroups = groupTabsByDomain(pinnedRealTabs);
  domainGroups       = groupTabsByDomain(regularRealTabs);

  // --- Render domain cards ---
  const openTabsSection       = document.getElementById('openTabsSection');
  const openTabsSubSection    = document.getElementById('openTabsSubSection');
  const openTabsMissionsEl    = document.getElementById('openTabsMissions');
  const openTabsSectionCount  = document.getElementById('openTabsSectionCount');
  const openTabsSectionTitle  = document.getElementById('openTabsSectionTitle');
  const openTabsSectionAction = document.getElementById('openTabsSectionAction');
  const pinnedSubSection      = document.getElementById('pinnedSubSection');
  const pinnedMissionsEl      = document.getElementById('pinnedMissions');
  const pinnedSectionCount    = document.getElementById('pinnedSectionCount');
  const pinnedSectionTitle    = document.getElementById('pinnedSectionTitle');

  // Build a Set of favorited URLs so domain cards can render the ⭐ active state
  const favoritedUrls = new Set((await getFavorites()).map(f => f.url));

  // Pinned sub-section
  if (pinnedSubSection) {
    if (pinnedDomainGroups.length > 0) {
      if (pinnedSectionTitle) pinnedSectionTitle.textContent = t('pinned');
      if (pinnedSectionCount) pinnedSectionCount.innerHTML = t('nTabsCount', pinnedRealTabs.length);
      pinnedMissionsEl.innerHTML = pinnedDomainGroups.map(g => renderDomainCard(g, favoritedUrls)).join('');
      pinnedSubSection.style.display = 'block';
    } else {
      pinnedSubSection.style.display = 'none';
    }
  }

  // Open-tabs section is always visible — the column should hold its 50%
  // width even when there are no open tabs, so the favorites column can't
  // expand to swallow the whole page.
  if (openTabsSection) openTabsSection.style.display = 'block';

  if (domainGroups.length > 0 && openTabsSubSection) {
    if (openTabsSectionTitle) openTabsSectionTitle.textContent = t('openTabs');
    openTabsSectionCount.innerHTML = t('nDomains', domainGroups.length);
    if (openTabsSectionAction) {
      openTabsSectionAction.innerHTML = `<button class="action-btn close-tabs" data-action="close-all-open-tabs">${ICONS.close} ${t('closeAllN', regularRealTabs.length)}</button>`;
    }
    openTabsMissionsEl.innerHTML = domainGroups.map(g => renderDomainCard(g, favoritedUrls)).join('');
    openTabsSubSection.style.display = 'block';
  } else if (openTabsSubSection) {
    openTabsSubSection.style.display = 'none';
    if (openTabsSectionAction) openTabsSectionAction.innerHTML = '';
  }

  // --- Footer stats ---
  const statTabs = document.getElementById('statTabs');
  if (statTabs) statTabs.textContent = openTabs.length;

  // --- Check for duplicate tab-out tabs ---
  checkTabOutDupes();

  // --- Render "Long-term Favorites" column ---
  await renderFavoritesColumn();
}

async function renderDashboard() {
  await renderStaticDashboard();
}


/* ----------------------------------------------------------------
   EVENT HANDLERS — using event delegation

   One listener on document handles ALL button clicks.
   Think of it as one security guard watching the whole building
   instead of one per door.
   ---------------------------------------------------------------- */

document.addEventListener('click', async (e) => {
  // Walk up the DOM to find the nearest element with data-action
  const actionEl = e.target.closest('[data-action]');
  if (!actionEl) return;

  const action = actionEl.dataset.action;

  // ---- Close duplicate tab-out tabs ----
  if (action === 'close-tabout-dupes') {
    await closeTabOutDupes();
    playCloseSound();
    const banner = document.getElementById('tabOutDupeBanner');
    if (banner) {
      banner.style.transition = 'opacity 0.4s';
      banner.style.opacity = '0';
      setTimeout(() => { banner.style.display = 'none'; banner.style.opacity = '1'; }, 400);
    }
    showToast(t('closedExtras'));
    return;
  }

  // ---- Language toggle ----
  if (action === 'toggle-lang') {
    await saveLang(currentLang === 'zh' ? 'en' : 'zh');
    applyStaticI18n();
    await renderDashboard();
    return;
  }

  // ---- Theme toggle (light / dark) ----
  if (action === 'toggle-theme') {
    await toggleTheme();
    return;
  }

  // ---- Favorites: toggle add modal ----
  if (action === 'toggle-favorite-form') {
    const modal = document.getElementById('favoritesModal');
    const btn   = document.getElementById('favoritesAddToggle');
    if (!modal) return;
    const showing = modal.style.display !== 'none';
    if (showing) {
      resetFavoriteForm();
      modal.style.display = 'none';
      if (btn) btn.classList.remove('open');
    } else {
      resetFavoriteForm();
      modal.style.display = 'flex';
      if (btn) btn.classList.add('open');
      const urlInput = document.getElementById('favoritesUrlInput');
      if (urlInput) setTimeout(() => urlInput.focus(), 0);
    }
    return;
  }

  // ---- Favorites: cancel (close modal) ----
  if (action === 'cancel-favorite-form') {
    closeFavoriteModal();
    return;
  }

  // ---- Favorites: delete from edit modal ----
  if (action === 'delete-from-form') {
    const form = document.getElementById('favoritesForm');
    const id   = form && form.dataset.editingId;
    if (!id) return;
    await removeFavorite(id);
    closeFavoriteModal();
    await renderFavoritesColumn();
    showToast(t('removedFromFavorites'));
    return;
  }

  // ---- Click on modal backdrop closes it ----
  if (e.target.id === 'favoritesModal') {
    closeFavoriteModal();
    return;
  }

  // (Favorite cards are real <a href> links — the browser handles
  //  navigation, modifier keys, middle-click, and right-click context
  //  menu natively. No JS click handler needed for plain opens.)

  // ---- Favorites: open the 3-dot menu next to the card (click again to close) ----
  if (action === 'favorite-menu') {
    // Stop the parent <a> link from navigating when the menu button is clicked.
    e.preventDefault();
    e.stopPropagation();
    const id = actionEl.dataset.favId;
    if (!id) return;
    const existing = document.getElementById('favoritePopupMenu');
    if (existing && existing.dataset.favId === id) {
      closeFavoriteMenu();
    } else {
      closeFavoriteMenu();
      openFavoriteMenu(actionEl, id);
    }
    return;
  }

  // ---- Menu items ----
  if (action === 'menu-edit-favorite') {
    const id = actionEl.dataset.favId;
    closeFavoriteMenu();
    if (id) await openEditFavorite(id);
    return;
  }
  if (action === 'menu-remove-favorite') {
    const id = actionEl.dataset.favId;
    closeFavoriteMenu();
    if (id) {
      await removeFavorite(id);
      await renderFavoritesColumn();
      showToast(t('removedFromFavorites'));
    }
    return;
  }


  // ---- Favorites: reset logo to default favicon ----
  if (action === 'reset-favorite-logo') {
    pendingLogoDataUrl = null;
    clearCustomLogo    = true;

    // Re-derive favicon from current URL input for live preview
    const urlVal = document.getElementById('favoritesUrlInput').value.trim();
    setLogoPreviewForUrl(urlVal);
    return;
  }


  // ---- Favorites: star a tab from a chip ----
  if (action === 'favorite-tab') {
    e.stopPropagation();
    const tabUrl = actionEl.dataset.tabUrl;
    if (!tabUrl) return;

    const already = await isFavorited(tabUrl);
    if (already) {
      // Removing is destructive enough to warrant a confirm.
      const ok = await showConfirm({
        message: t('confirmRemoveFav'),
        okLabel: t('remove'),
      });
      if (!ok) return;
      const favs = await getFavorites();
      const fav  = favs.find(f => f.url === tabUrl);
      if (fav) await removeFavorite(fav.id);
      actionEl.classList.remove('active');
      showToast(t('removedFromFavorites'));
    } else {
      // No title — let addFavorite derive a clean brand name from the URL
      // (e.g. "Binance" from www.binance.com).
      const ok = await addFavorite(tabUrl);
      if (ok) {
        actionEl.classList.add('active');
        showToast(t('addedToFavorites'));
      } else {
        showToast(t('alreadyAdded'));
      }
    }
    await renderFavoritesColumn();
    return;
  }

  const card = actionEl.closest('.mission-card');

  // ---- Expand overflow chips ("+N more") ----
  if (action === 'expand-chips') {
    const overflowContainer = actionEl.parentElement.querySelector('.page-chips-overflow');
    if (overflowContainer) {
      overflowContainer.style.display = 'contents';
      actionEl.remove();
    }
    return;
  }

  // ---- Focus a specific tab ----
  if (action === 'focus-tab') {
    const tabId = parseInt(actionEl.dataset.tabId, 10);
    if (!Number.isNaN(tabId)) {
      try {
        const tab = await chrome.tabs.get(tabId);
        await chrome.tabs.update(tabId, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
        return;
      } catch { /* tab gone — fall through to URL fallback */ }
    }
    const tabUrl = actionEl.dataset.tabUrl;
    if (tabUrl) await focusTab(tabUrl);
    return;
  }

  // ---- Close a single tab ----
  if (action === 'close-single-tab') {
    e.stopPropagation(); // don't trigger parent chip's focus-tab
    const tabId = parseInt(actionEl.dataset.tabId, 10);
    if (Number.isNaN(tabId)) return;

    // Close THIS exact tab — using its id, not URL (multiple tabs may
    // share the same URL but represent different open windows).
    try { await chrome.tabs.remove(tabId); } catch {}
    await fetchOpenTabs();

    playCloseSound();

    // Animate the chip row out
    const chip = actionEl.closest('.page-chip');
    if (chip) {
      const rect = chip.getBoundingClientRect();
      shootConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      chip.style.transition = 'opacity 0.2s, transform 0.2s';
      chip.style.opacity    = '0';
      chip.style.transform  = 'scale(0.8)';
      setTimeout(() => {
        chip.remove();
        // If the card now has no tabs, remove it too
        const parentCard = document.querySelector('.mission-card:has(.mission-pages:empty)');
        if (parentCard) animateCardOut(parentCard);
        document.querySelectorAll('.mission-card').forEach(c => {
          if (c.querySelectorAll('.page-chip[data-action="focus-tab"]').length === 0) {
            animateCardOut(c);
          }
        });
      }, 200);
    }

    // Update footer
    const statTabs = document.getElementById('statTabs');
    if (statTabs) statTabs.textContent = openTabs.length;

    showToast(t('tabClosed'));
    return;
  }

  // ---- Pin / unpin a single tab in Chrome (use exact tab id, not URL) ----
  if (action === 'pin-tab') {
    e.stopPropagation();
    const tabId = parseInt(actionEl.dataset.tabId, 10);
    if (Number.isNaN(tabId)) return;
    let tab;
    try { tab = await chrome.tabs.get(tabId); } catch { return; }
    const newPinned = !tab.pinned;
    await chrome.tabs.update(tabId, { pinned: newPinned });
    // Optimistic UI: flip the active class + tooltip. CSS handles the fill.
    // The live re-render listener will refresh the cards in full right after.
    actionEl.classList.toggle('active', newPinned);
    actionEl.title = newPinned ? t('unpinTip') : t('pinTip');
    return;
  }

  // ---- Close all tabs in a domain group ----
  if (action === 'close-domain-tabs') {
    const domainId    = actionEl.dataset.domainId;
    // Search the right group list based on which sub-section the X is in.
    const inPinned    = !!actionEl.closest('#pinnedSubSection');
    const sourceList  = inPinned ? pinnedDomainGroups : domainGroups;
    const group       = sourceList.find(g => 'domain-' + g.domain.replace(/[^a-z0-9]/g, '-') === domainId);
    if (!group) return;

    // Close exactly THIS group's tabs by id — robust against same-URL tabs
    // existing in the other section (pinned/unpinned).
    const tabIds = group.tabs.map(t => t.id).filter(Boolean);
    if (tabIds.length > 0) {
      try { await chrome.tabs.remove(tabIds); } catch {}
      await fetchOpenTabs();
    }

    if (card) {
      playCloseSound();
      animateCardOut(card);
    }

    // Remove from in-memory groups
    const idx = sourceList.indexOf(group);
    if (idx !== -1) sourceList.splice(idx, 1);

    const groupLabel = group.domain === '__landing-pages__' ? t('homepages') : (group.label || friendlyDomain(group.domain));
    showToast(t('closedNFromX', tabIds.length, groupLabel));

    const statTabs = document.getElementById('statTabs');
    if (statTabs) statTabs.textContent = openTabs.length;
    return;
  }

  // ---- Close duplicates of THIS specific URL (the inline chip badge) ----
  // Scoped to the same pin-state as the source chip — pinned and unpinned
  // sections are dedup'd separately, so a pinned tab is never used as the
  // "keep" for the unpinned section's dedup.
  if (action === 'dedup-this-url') {
    e.stopPropagation();
    e.preventDefault();
    const url    = actionEl.dataset.tabUrl;
    const chip   = actionEl.closest('.page-chip');
    const chipId = chip ? parseInt(chip.dataset.tabId, 10) : NaN;
    if (!url) return;

    const allTabs   = await chrome.tabs.query({});
    const sourceTab = !Number.isNaN(chipId) ? allTabs.find(t => t.id === chipId) : null;
    const wantPinned = sourceTab ? !!sourceTab.pinned : false;
    const matching = allTabs.filter(t => t.url === url && !!t.pinned === wantPinned);
    if (matching.length <= 1) return;

    // Keep the active match if any, else the first; close the rest.
    const keep = matching.find(t => t.active) || matching[0];
    const toClose = matching.filter(t => t.id !== keep.id).map(t => t.id);
    if (toClose.length > 0) await chrome.tabs.remove(toClose);
    await fetchOpenTabs();

    playCloseSound();
    // Fade out the badge — live re-render listener will refresh the card.
    actionEl.style.transition = 'opacity 0.2s';
    actionEl.style.opacity    = '0';
    setTimeout(() => actionEl.remove(), 200);
    showToast(t('closedDupes'));
    return;
  }

  // ---- Close ALL open tabs ----
  if (action === 'close-all-open-tabs') {
    const allUrls = openTabs
      .filter(t => t.url && !t.url.startsWith('chrome') && !t.url.startsWith('about:'))
      .map(t => t.url);
    await closeTabsByUrls(allUrls);
    playCloseSound();

    document.querySelectorAll('#openTabsMissions .mission-card').forEach(c => {
      shootConfetti(
        c.getBoundingClientRect().left + c.offsetWidth / 2,
        c.getBoundingClientRect().top  + c.offsetHeight / 2
      );
      animateCardOut(c);
    });

    showToast(t('allTabsClosed'));
    return;
  }
});

/* ----------------------------------------------------------------
   FAVORITES FORM — shared state for add/edit mode

   pendingLogoDataUrl:
     - null   = no new logo uploaded this session (keep current value on save)
     - string = data URL the user just picked, save as customLogo

   clearCustomLogo:
     - true   = user clicked "Reset", remove customLogo on save (revert to favicon)
     - false  = leave customLogo alone
   ---------------------------------------------------------------- */
let pendingLogoDataUrl = null;
let clearCustomLogo    = false;

function setLogoPreview(src, fallbackList = []) {
  const placeholder = document.getElementById('favoritesLogoPlaceholder');
  const img         = document.getElementById('favoritesLogoPreviewImg');
  if (!img || !placeholder) return;
  if (src) {
    img.dataset.fallback = fallbackList.join('|');
    img.src = src;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.removeAttribute('src');
    delete img.dataset.fallback;
    img.style.display = 'none';
    placeholder.style.display = 'block';
  }
}

/**
 * Set the logo preview using the same fallback chain as favorite cards.
 * Customizable: pass a customLogo data URL to skip the chain entirely.
 */
function setLogoPreviewForUrl(pageUrl, customLogo = null) {
  if (customLogo) { setLogoPreview(customLogo); return; }
  const chain = getFaviconFallbackChain(pageUrl, 128);
  if (chain.length === 0) { setLogoPreview(''); return; }
  setLogoPreview(chain[0], chain.slice(1));
}

function resetFavoriteForm() {
  const form = document.getElementById('favoritesForm');
  if (!form) return;
  form.dataset.editingId = '';
  document.getElementById('favoritesUrlInput').value   = '';
  document.getElementById('favoritesTitleInput').value = '';
  document.getElementById('favoritesLogoInput').value  = '';
  document.getElementById('favoritesFormSubmit').textContent = 'Add';
  const delBtn = document.getElementById('favoritesFormDelete');
  if (delBtn) delBtn.style.display = 'none';
  setLogoPreview('');
  pendingLogoDataUrl = null;
  clearCustomLogo    = false;
}

function closeFavoriteModal() {
  const modal = document.getElementById('favoritesModal');
  const btn   = document.getElementById('favoritesAddToggle');
  resetFavoriteForm();
  if (modal) modal.style.display = 'none';
  if (btn)   btn.classList.remove('open');
}

/**
 * showConfirm({ message, okLabel?, cancelLabel? })
 * Returns Promise<boolean> — resolves true on confirm, false on cancel /
 * Esc / backdrop click. In-page modal styled to match the rest of the app.
 */
function showConfirm({ message, okLabel, cancelLabel } = {}) {
  return new Promise((resolve) => {
    const modal     = document.getElementById('confirmModal');
    const msgEl     = document.getElementById('confirmMessage');
    const okBtn     = document.getElementById('confirmOkBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');
    if (!modal || !msgEl || !okBtn || !cancelBtn) {
      resolve(window.confirm(message || ''));
      return;
    }

    msgEl.textContent     = message || '';
    okBtn.textContent     = okLabel     || t('confirmOk');
    cancelBtn.textContent = cancelLabel || t('cancel');
    modal.style.display = 'flex';

    const cleanup = () => {
      modal.style.display = 'none';
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      modal.removeEventListener('click', onBackdrop);
      document.removeEventListener('keydown', onKey, true);
    };
    const onOk     = () => { cleanup(); resolve(true);  };
    const onCancel = () => { cleanup(); resolve(false); };
    const onBackdrop = (e) => { if (e.target === modal) onCancel(); };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onCancel(); }
      else if (e.key === 'Enter') { e.stopPropagation(); onOk(); }
    };

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    modal.addEventListener('click', onBackdrop);
    document.addEventListener('keydown', onKey, true);

    // Default focus the safer choice (cancel)
    setTimeout(() => cancelBtn.focus(), 0);
  });
}

async function openEditFavorite(id) {
  const favs = await getFavorites();
  const fav  = favs.find(f => f.id === id);
  if (!fav) return;
  document.getElementById('favoritesUrlInput').value   = fav.url || '';
  document.getElementById('favoritesTitleInput').value = fav.title || '';
  setLogoPreviewForUrl(fav.url, fav.customLogo);
  pendingLogoDataUrl = null;
  clearCustomLogo    = false;
  const form  = document.getElementById('favoritesForm');
  const modal = document.getElementById('favoritesModal');
  form.dataset.editingId = id;
  if (modal) modal.style.display = 'flex';
  document.getElementById('favoritesAddToggle').classList.add('open');
  document.getElementById('favoritesFormSubmit').textContent = 'Save';
  const delBtn = document.getElementById('favoritesFormDelete');
  if (delBtn) delBtn.style.display = 'inline-flex';
}

function openFavoriteMenu(anchorEl, favId) {
  const menu = document.createElement('div');
  menu.id = 'favoritePopupMenu';
  menu.className = 'favorite-popup-menu';
  menu.dataset.favId = favId;
  menu.innerHTML = `
    <button class="favorite-popup-item" data-action="menu-edit-favorite"   data-fav-id="${favId}">${t('edit')}</button>
    <button class="favorite-popup-item favorite-popup-item-danger" data-action="menu-remove-favorite" data-fav-id="${favId}">${t('remove')}</button>
  `;
  document.body.appendChild(menu);

  // Position below-and-aligned-right with the anchor; clamp to viewport.
  const r = anchorEl.getBoundingClientRect();
  const m = menu.getBoundingClientRect();
  let top  = r.bottom + 4;
  let left = r.right  - m.width;
  if (top + m.height > window.innerHeight - 4) top = r.top - m.height - 4;
  if (left < 4) left = 4;
  menu.style.top  = `${top}px`;
  menu.style.left = `${left}px`;
}

function closeFavoriteMenu() {
  const menu = document.getElementById('favoritePopupMenu');
  if (menu) menu.remove();
}

// Click outside the menu closes it.
document.addEventListener('click', (e) => {
  if (!document.getElementById('favoritePopupMenu')) return;
  if (e.target.closest('#favoritePopupMenu')) return;
  if (e.target.closest('[data-action="favorite-menu"]')) return;
  closeFavoriteMenu();
});

// Escape closes whichever overlay is open.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const modal = document.getElementById('favoritesModal');
  if (modal && modal.style.display !== 'none') { closeFavoriteModal(); return; }
  closeFavoriteMenu();
});

/**
 * Downscale an image blob to fit within `maxSize × maxSize` using a canvas,
 * exporting as a PNG data URL. Preserves transparency. Never upscales —
 * a 100×100 image stays 100×100. Output is typically a few KB regardless
 * of input size, which is what keeps chrome.storage.local from filling up.
 */
function compressImage(blob, maxSize = 256) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const srcW = img.naturalWidth  || img.width;
      const srcH = img.naturalHeight || img.height;
      if (!srcW || !srcH) { reject(new Error('zero-size image')); return; }
      const ratio = Math.min(maxSize / srcW, maxSize / srcH, 1);
      const w = Math.max(1, Math.round(srcW * ratio));
      const h = Math.max(1, Math.round(srcH * ratio));
      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Stage an image blob as the favorite's custom logo. Used by both the
 * file picker and the clipboard-paste path. Auto-compresses to ≤256×256
 * so storage stays small no matter how big the original image is.
 */
async function stageCustomLogoFromBlob(blob) {
  if (!blob || !blob.type || !blob.type.startsWith('image/')) return;
  try {
    const dataUrl = await compressImage(blob, 256);
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return;
    pendingLogoDataUrl = dataUrl;
    clearCustomLogo    = false;
    setLogoPreview(dataUrl);
  } catch (err) {
    console.warn('[wolfy] image compress failed:', err);
  }
}

// ---- Logo file picker — read as base64 data URL, show in preview ----
document.addEventListener('change', (e) => {
  if (e.target.id !== 'favoritesLogoInput') return;
  const file = e.target.files && e.target.files[0];
  if (file) stageCustomLogoFromBlob(file);
});

// ---- Paste an image from the clipboard while the favorites modal is open.
//      Works whether focus is on the URL/title input, on the form itself,
//      or just on the modal — anywhere inside.
document.addEventListener('paste', async (e) => {
  const modal = document.getElementById('favoritesModal');
  if (!modal || modal.style.display === 'none') return;
  const items = (e.clipboardData && e.clipboardData.items) || [];
  for (const item of items) {
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (!file) continue;
      e.preventDefault();
      await stageCustomLogoFromBlob(file);
      return;
    }
  }
});

// ---- Live preview update: when URL field changes and no custom logo
//      is staged, pull a favicon for the new domain so the preview tracks
//      what the saved card will look like. ----
document.addEventListener('input', (e) => {
  if (e.target.id !== 'favoritesUrlInput') return;
  if (pendingLogoDataUrl) return;          // user staged an upload — leave it alone
  const form = document.getElementById('favoritesForm');
  // While editing, only auto-update the preview if user clicked Reset
  // (otherwise we'd clobber their existing custom logo on every keystroke)
  if (form.dataset.editingId && !clearCustomLogo) return;
  const url = e.target.value.trim();
  setLogoPreviewForUrl(url);
});

// ---- Favorites form submission (handles both add and edit) ----
document.addEventListener('submit', async (e) => {
  if (e.target.id !== 'favoritesForm') return;
  e.preventDefault();

  const form       = e.target;
  const editingId  = form.dataset.editingId || '';
  const urlInput   = document.getElementById('favoritesUrlInput');
  const titleInput = document.getElementById('favoritesTitleInput');
  let   url        = urlInput.value.trim();
  let   title      = titleInput.value.trim();
  if (!url) return;

  // Auto-prepend https:// if the user typed a bare domain (e.g. "binance.com").
  // Without this we'd save invalid-looking URLs that later fail to navigate.
  if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) {
    url = 'https://' + url;
  }

  if (!title) {
    try { title = friendlyDomain(new URL(url).hostname); }
    catch { title = url; }
  }

  try {
    if (editingId) {
      const fields = { url, title };
      if (pendingLogoDataUrl)      fields.customLogo = pendingLogoDataUrl;
      else if (clearCustomLogo)    fields.customLogo = null;  // null sentinel → delete
      await updateFavorite(editingId, fields);
      showToast(t('favoriteUpdated'));
    } else {
      const ok = await addFavorite(url, title, pendingLogoDataUrl);
      if (!ok) {
        showToast(t('alreadyAdded'));
        return;
      }
      showToast(t('addedToFavorites'));
    }
  } catch (err) {
    // Most likely cause: chrome.storage.local quota exceeded.
    console.error('[wolfy] save favorite failed:', err);
    showToast(t('saveFailed'));
    return;
  }

  closeFavoriteModal();

  await renderFavoritesColumn();
  document.querySelectorAll(`.chip-star[data-tab-url="${url.replace(/"/g, '&quot;')}"]`).forEach(b => b.classList.add('active'));
});


/* ----------------------------------------------------------------
   FAVORITES DRAG-AND-DROP — reorder cards within the favorites column.

   Scope: strictly limited to the favorites column. Drops elsewhere on
   the page (including the OpenTabs section) are ignored. This is
   intentional — dragging onto OpenTabs used to "open as new tab", but
   that feature was confusing and got removed.

   Drop targets:
     - another card        → swap slots
     - empty slot          → place there
     - anywhere else       → no-op
   ---------------------------------------------------------------- */
let _draggedFavId = null;

function clearDropMarkers() {
  document.querySelectorAll('.favorite-item.drop-target, .favorite-slot-empty.drop-target')
    .forEach(el => el.classList.remove('drop-target'));
}

document.addEventListener('dragstart', (e) => {
  const item = e.target.closest('.favorite-item');
  if (!item) return;
  _draggedFavId = item.dataset.favId;
  item.classList.add('dragging');
  document.body.classList.add('dragging-favorite');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', _draggedFavId);
});

document.addEventListener('dragend', () => {
  document.querySelectorAll('.favorite-item.dragging')
    .forEach(el => el.classList.remove('dragging'));
  document.body.classList.remove('dragging-favorite');
  clearDropMarkers();
  _draggedFavId = null;
});

document.addEventListener('dragover', (e) => {
  if (!_draggedFavId) return;

  // Hovering another card → reorder (swap slots on drop)
  const card = e.target.closest('.favorite-item');
  if (card && card.dataset.favId && card.dataset.favId !== _draggedFavId) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    clearDropMarkers();
    card.classList.add('drop-target');
    return;
  }

  // Hovering an empty slot → place there
  const slot = e.target.closest('.favorite-slot-empty');
  if (slot) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    clearDropMarkers();
    slot.classList.add('drop-target');
  }
  // No third branch — drops outside the favorites grid are not allowed.
});

document.addEventListener('drop', async (e) => {
  if (!_draggedFavId) return;
  const draggedId = _draggedFavId;
  _draggedFavId = null;

  // Drop on another card → swap slots
  const card = e.target.closest('.favorite-item');
  if (card && card.dataset.favId && card.dataset.favId !== draggedId) {
    e.preventDefault();
    clearDropMarkers();
    const favorites = await getFavorites();
    const a = favorites.find(f => f.id === draggedId);
    const b = favorites.find(f => f.id === card.dataset.favId);
    if (a && b) {
      const tmp = a.slot;
      a.slot = b.slot;
      b.slot = tmp;
      await chrome.storage.local.set({ favorites });
      await renderFavoritesColumn();
    }
    return;
  }

  // Drop on an empty slot → set slot
  const slot = e.target.closest('.favorite-slot-empty');
  if (slot) {
    e.preventDefault();
    clearDropMarkers();
    const newSlot = parseInt(slot.dataset.slot, 10);
    if (!Number.isNaN(newSlot)) {
      await setFavoriteSlot(draggedId, newSlot);
      await renderFavoritesColumn();
    }
    return;
  }

  clearDropMarkers();
});


/* ----------------------------------------------------------------
   LIVE UPDATES — re-render whenever Chrome's tab state changes

   Without this, opening a favorite (or any tab change in another window)
   wouldn't show up here until the user manually refreshed the page.
   Debounced so a burst of events triggers exactly one re-render.
   ---------------------------------------------------------------- */
let _rerenderTimer = null;
function scheduleLiveRerender() {
  if (_rerenderTimer) clearTimeout(_rerenderTimer);
  _rerenderTimer = setTimeout(() => {
    _rerenderTimer = null;
    renderDashboard();
  }, 150);
}

if (chrome.tabs && chrome.tabs.onCreated) {
  chrome.tabs.onCreated.addListener(scheduleLiveRerender);
  chrome.tabs.onRemoved.addListener(scheduleLiveRerender);
  chrome.tabs.onUpdated.addListener((_id, changeInfo) => {
    // Re-render only on URL/title/pin changes; skip per-keystroke status flips
    if (changeInfo.url || changeInfo.title || 'pinned' in changeInfo) {
      scheduleLiveRerender();
    }
  });
  chrome.tabs.onMoved.addListener(scheduleLiveRerender);
  // Switching tabs updates lastAccessed → re-sort by recency
  if (chrome.tabs.onActivated) chrome.tabs.onActivated.addListener(scheduleLiveRerender);
}

// Storage changes can come from another context (e.g. right-click menu in
// background.js adds a favorite) — re-render so the page stays in sync.
if (chrome.storage && chrome.storage.onChanged) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (!changes.favorites) return;
    if (_suppressFavReRender) return;   // local iconUrl batch write — skip
    renderFavoritesColumn();
  });
}


/* ----------------------------------------------------------------
   INITIALIZE
   ---------------------------------------------------------------- */
(async () => {
  await loadLang();
  await loadTheme();
  await migrateAwayFromFolders();
  applyStaticI18n();
  await renderDashboard();
})();
