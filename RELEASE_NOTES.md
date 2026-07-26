# Smart Tab Dedupe & Jump — Rewrite

Fixes one report: **"smart tab dedupe & jump mostly doesn't work — the browser still opens duplicate pages."** It turned out to be six overlapping defects. One of them also risked data loss, so **upgrading is recommended for everyone**.

## What's new

**Dedupe now actually fires.** Previously only a plain left-click on an `<a>` element was intercepted, and even that often lost a race. Now covered:

| Source of the duplicate tab | Before | Now |
| --- | :---: | :---: |
| `target="_blank"` link click | sometimes | ✅ |
| Same-window link click | ✅ | ✅ |
| `window.open()` from page JS | ❌ | ✅ |
| Bookmarks, address bar, history | ❌ | ✅ |
| External apps (mail, chat clients) | ❌ | ✅ |
| JS-driven navigation (no `<a href>`) | ❌ | ✅ |
| Pages where the content script fails to inject | ❌ | ✅ |

**Multiple URLs for the same page are now recognized.** These three Baidu result pages used to count as three different pages:

```
/s?wd=QUERY&rqid=91f07d000002e6bc&rsf=8f44c761...
/s?wd=QUERY&rqid=c1fc55400002f705&rsf=523d2ed0...
/s?wd=QUERY&from=super&cl=3&hisfilter=1
```

URL matching now ignores `http`/`https`, a `www.` prefix, trailing slashes, tracking params (`utm_*`, `spm_*`, `fbclid`, `vd_source`, …), query-param order, `+` vs `%20`, and `#section` anchors — while still treating `#/path` hash routes as distinct pages. Search engines, whose URLs carry a lot of session noise, use a per-site param allowlist instead: Baidu, Google, Bing, DuckDuckGo, Sogou, 360, Zhihu, Bilibili search, Weibo search, and YouTube watch pages (so the same video with different timestamp/playlist/source params collapses to one).

**Jumps carry the anchor.** Clicking `page#install` when `page` is already open jumps to that tab *and* scrolls to `#install` — only when the two URLs differ by nothing but the fragment, so the target tab is never reloaded and never loses its state.

**No more slowing down SPAs.** The old build speculatively called `preventDefault()` on every same-window link click, waited on a background round-trip, then did a full page load — downgrading client-side routing to a full reload on sites like GitHub and swallowing the site's own click handlers. Interception now happens only when a duplicate is confirmed synchronously.

**Dedupe is no longer disabled along with preloading.** They are independent settings, but turning off preloading — or disabling it for one site under Site Rules (`douyin.com` is off by default) — used to silently kill dedupe too.

## Fixes

1. **Race condition (the main cause).** The check ran asynchronously on `mousedown`, but `mousedown` → `click` is only tens of milliseconds while an idle MV3 service worker needs a cold start well over 100 ms. The answer never arrived in time, and `_blank` links depended entirely on that cache — which is exactly where duplicates come from. Replaced with a background-maintained index of open pages, pushed to content scripts, so click-time lookups are fully synchronous.
2. **URLs compared verbatim.** Any difference in trailing slash, scheme, `www.`, tracking params or param order caused a miss — and an open tab stores its URL *after* redirects, so it rarely matched the link as written.
3. **Anchored links never reached the dedupe path**, blocked by a preload precondition, even though the matcher deliberately stripped fragments. Preloading and dedupe now use separate predicates.
4. **Preload-window ID reused across sessions — excluded a real window from dedupe entirely.** ⚠️ *Also risked data loss.* The hidden preload window's ID was stored in `chrome.storage.local` and survived restarts, but Chrome assigns window IDs from a per-session counter that restarts from a small number. On the next launch that stale ID could land on one of your real windows, and the restore path adopted it after only checking that the window existed. Consequences: the whole window was skipped for dedupe (**duplicates kept opening in your main window and were never closed**), the window was silently minimized, clearing the cache closed every non-blank tab in it (**real data loss**), and other windows could be closed outright. The ID now lives in `chrome.storage.session`, whose lifetime matches the validity of a window ID, and restore validates window geometry before adopting anything.
5. **Foreground/background misdetection silently skipped interception.** Chromium inserts a new tab and updates the selection in two steps, so `onCreated` can report `active: false` for a tab that *is* opening in the foreground. A tab now counts as foreground if it is active at creation or becomes active immediately after; genuine background opens (middle-click, Ctrl+click) are still passed through.
6. **Background logs never emitted**, making all of this hard to diagnose: the debug flag was captured at module load, but service workers have no `localStorage` and the module loads before any flag can be set. It is now evaluated per call and read from `chrome.storage.local`; run `chrome.storage.local.set({debug: 1})` in the service worker console to enable.
7. **Query-encoding ambiguity caused false matches.** Comparison keys were built from decoded param values, so `?a=1%26b%3D2` and `?a=1&b=2` produced the same key — two different pages treated as one, jumping to the wrong tab.

## Intentional limits

- **Current window only.** Duplicates in other windows still open.
- **Middle-click and Ctrl+click are left alone** — treated as "I explicitly want another copy."
- **A brief tab flash** when the tab-level net catches it. Chrome does not allow blocking tab creation, so the tab is created and closed immediately; navigation has usually not committed yet, so closing cancels the request. The content-script fast path has no flash.
- **Re-opening the page you are already on is allowed** (clicking a link to the current page, duplicating a tab) — that is deliberate intent.
- **The param allowlist only covers sites we are sure about.** Faceted e-commerce search is deliberately excluded: its meaningful params are hard to enumerate, and dropping one would merge different filter states and jump to the wrong tab. A missed jump is a minor annoyance; a wrong jump is confusing.

## Implementation

MV3 has no API that can truly cancel a navigation — blocking `webRequest` is gone, `declarativeNetRequest` cannot match dynamic state like "is this already open," and `webNavigation` can only observe. So interception is layered:

1. **Content script** (fast path, no flash) — pushed index of open pages plus a synchronous lookup on click.
2. **Tab level** (catch-all) — on `chrome.tabs.onCreated`, if the target URL is already open in the same window, activate that tab and close the new one.

Details that matter: decisions are serialized, otherwise two concurrently opened tabs with the same URL each treat the other as pre-existing and both get closed; a new tab is watched for a short window afterwards to catch the post-redirect URL, and watching stops at load completion so the user's own later navigation is untouched; the target is activated *before* the new tab is closed, since the reverse makes Chrome hand focus to a neighbouring tab first and produces a visible jump.

New files: `src/background/tab-index.js` (per-window index of open pages, pushed to content scripts), `src/background/tab-guard.js` (tab-level interception), `src/content/open-tabs.js` (content-side cache for synchronous lookups).

Main changes: `canonicalizeUrl` and `isDedupCandidateLink` in `src/shared/url-utils.js`; `URL_QUERY_RULES` and the tracking-param tables in `src/shared/constants.js`; window-ID storage and geometry validation in `src/background/preload-window.js`; click handling and activation state in `src/content/main.js`; per-call flag evaluation in `src/shared/logger.js`. 13 files, +790 / −133.

## Commits

- `1d609de` fix: smart tab dedupe & jump failed in most cases
- `7ea08f1` feat: intercept duplicate opens at the tab level
- `95ad411` feat: per-site URL normalization rules for same-content-multiple-URLs
- `e5ffc7e` fix: preload-window ID reused across sessions excluded a whole window from dedupe

## Feedback

Still hitting a site where the same page doesn't trigger a jump? Open an issue with **two full URLs that should count as the same page** and a normalization rule can be added for it.
