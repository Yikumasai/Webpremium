// 共享常量与默认配置

export const DEFAULT_SETTINGS = Object.freeze({
  preloadEnabled: true,
  hoverDelay: 100,
  maxPreloads: 5,
  preloadTimeout: 30_000,
  preloadMode: 'hidden-tab',
  darkMode: 'auto',
  networkAware: true,
  showIndicator: true,
  mutePreload: true,
  smartTabDedup: true,
  tabOutEnabled: false,
  shortcutsEnabled: false,
});

/**
 * 首次安装时种子到 site rules 的默认禁用域名。
 * 这些站点通常会自动播放视频/直播，预加载价值低且容易产生干扰。
 * 用户可以在"网站规则"页里手动启用。
 */
export const DEFAULT_SITE_RULES = Object.freeze({
  'douyin.com': { enabled: false },
});

export const SETTINGS_KEYS = Object.freeze(Object.keys(DEFAULT_SETTINGS));

export const DEFAULT_STATS = Object.freeze({
  totalPreloads: 0,
  hitCount: 0,
  missCount: 0,
  savedTime: 0,
  sessionStart: Date.now(),
});

export const STORAGE_KEYS = Object.freeze({
  stats: 'preloadStats',
  siteRules: 'siteRules',
  favorites: 'favorites',
  theme: 'theme',
  uiLanguage: 'uiLanguage',
});

export const PRELOAD_TIMEOUT_MS = Object.freeze({
  'hidden-tab': 60_000,
  iframe: 30_000,
});

export const DOWNLOAD_EXTENSIONS = new Set([
  'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz',
  'exe', 'msi', 'dmg', 'pkg', 'deb', 'rpm', 'apk',
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'mp3', 'mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv',
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
  'iso', 'img', 'bin',
]);

export const MESSAGE = Object.freeze({
  GET_SETTINGS: 'getSettings',
  UPDATE_SETTINGS: 'updateSettings',
  SETTINGS_UPDATED: 'settingsUpdated',
  CREATE_BACKGROUND_TAB: 'createBackgroundTab',
  ACTIVATE_TAB: 'activateTab',
  ACTIVATE_EXISTING_TAB: 'activateExistingTab',
  GET_OPEN_TABS: 'getOpenTabs',
  OPEN_TABS_CHANGED: 'openTabsChanged',
  CLOSE_TAB: 'closeTab',
  TAB_CLOSED: 'tabClosed',
  UPDATE_PRELOAD_LIST: 'updatePreloadList',
  GET_CURRENT_PRELOADS: 'getCurrentPreloads',
  CLEAR_PRELOADS: 'clearPreloads',
  CLEAR_MY_PRELOADS: 'clearMyPreloads',
  GET_STATS: 'getStats',
  RECORD_HIT: 'recordHit',
  RESET_STATS: 'resetStats',
  GET_SITE_RULES: 'getSiteRules',
  UPDATE_SITE_RULE: 'updateSiteRule',
  SET_ALL_RULES_STATUS: 'setAllRulesStatus',
  CHECK_SITE_ENABLED: 'checkSiteEnabled',
  SITE_RULE_CHANGED: 'siteRuleChanged',
  TOGGLE_PRELOAD: 'togglePreload',
  PING: 'ping',
  NAVIGATE_TO_DEFAULT_NTP: 'navigateToDefaultNtp',
});

export const COMMAND = Object.freeze({
  TOGGLE_PRELOAD: 'toggle-preload',
  CLEAR_CACHE: 'clear-cache',
});

export const CONTEXT_MENU = Object.freeze({
  PRELOAD_LINK: 'preload-link',
  TOGGLE_SITE: 'toggle-site',
  TAB_OUT_FAVORITE_PAGE: 'tab-out-favorite-page',
  TAB_OUT_FAVORITE_LINK: 'tab-out-favorite-link',
});

export const PRELOAD_WINDOW_OPTS = Object.freeze({
  url: 'about:blank',
  type: 'normal',
  width: 300,
  height: 200,
  left: 0,
  top: 0,
  focused: false,
});

export const PRELOAD_WINDOW_TOLERANCE = Object.freeze({
  width: 120,
  height: 140,
  left: 120,
  top: 120,
});

/**
 * 判定"同一个网页"时应当忽略的查询参数（广告/统计来源标记）。
 * 前缀匹配 + 精确匹配两张表，命中即从规范化 URL 中剔除。
 */
export const TRACKING_PARAM_PREFIXES = Object.freeze([
  'utm_',
  'spm_',
  'ga_',
  'mc_',
  'pk_',
  'matomo_',
  'hsa_',
  'vero_',
]);

// 只收录含义明确的追踪参数。宁可漏掉一个（少一次跳转）也不要误删真实参数
// （会把不同页面判成同一页，跳到错误的标签页）—— 例如 ref 在部分站点表示分支/版本，
// 因此不在此列。
export const TRACKING_PARAMS = new Set([
  'fbclid', 'gclid', 'dclid', 'gbraid', 'wbraid', 'msclkid', 'yclid', 'twclid', 'ttclid',
  'igshid', 'mkt_tok', '_hsenc', '_hsmi', 'ref_src', 'ref_url',
  'spm', 'scm', 'share_source', 'share_medium', 'share_plat',
  'from_source', 'from_spmid', 'vd_source',
]);

export const INTERNAL_URL_PREFIXES = Object.freeze([
  'chrome://',
  'chrome-extension://',
  'about:',
  'edge://',
  'brave://',
  'vivaldi://',
  'opera://',
]);
