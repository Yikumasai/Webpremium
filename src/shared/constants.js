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
  searchPageNativeNav: true,
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
  'google.com': { enabled: false },
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

/**
 * 站点级 URL 归一规则。
 *
 * 有些站点同一份内容会有多个网址，差别只在会话/来源参数上。例如下面三个百度搜索
 * 结果页是同一页内容：
 *   /s?wd=X&rqid=91f07d000002e6bc&rsf=8f44c761...
 *   /s?wd=X&rqid=c1fc55400002f705&rsf=523d2ed0...
 *   /s?wd=X&from=super&cl=3&hisfilter=1
 * 这类参数名各站各样（rqid / from / cl / hisfilter …），靠通用的 TRACKING_PARAMS
 * 黑名单穷举不完。所以对这些站点反过来做：用白名单只保留决定内容的参数。
 *
 * 字段含义：
 *   hosts —— 与 canonicalizeUrl 归一后的主机名比较（已小写、已去 www.）
 *   paths —— 与归一后的路径比较（已去末尾斜杠，故 '/' 等价于 ''）
 *   keep  —— 参数白名单，小写比较；不在其中的参数一律丢弃
 *   alias —— 同义参数名映射到白名单里的那个（如百度的 word 等价于 wd）
 *
 * 新增规则的原则：宁可少丢一个参数（漏一次跳转）也不要多丢一个 —— 多丢会把不同
 * 页面判成同一页，跳到错误的标签页。因此这里不收录带复杂筛选条件的站点（电商的
 * 多维筛选搜索等），那类页面的有效参数很难穷举。
 */
export const URL_QUERY_RULES = Object.freeze([
  // 搜索引擎：查询词 + 分页 + 垂类/筛选 决定内容，其余都是会话与来源标记。
  // isSearch 标记搜索结果页，供 searchPageNativeNav 使用（见 isSearchResultPage）。
  {
    hosts: ['baidu.com'],
    paths: ['/s', '/baidu'],
    keep: ['wd', 'pn'],
    alias: { word: 'wd' },
    isSearch: true,
  },
  {
    hosts: ['google.com', 'google.com.hk'],
    paths: ['/search'],
    keep: ['q', 'start', 'tbm', 'tbs', 'udm'],
    isSearch: true,
  },
  { hosts: ['bing.com'], paths: ['/search'], keep: ['q', 'first'], isSearch: true },
  { hosts: ['duckduckgo.com'], paths: ['/'], keep: ['q', 'ia'], isSearch: true },
  { hosts: ['sogou.com'], paths: ['/web'], keep: ['query', 'page'], isSearch: true },
  { hosts: ['so.com'], paths: ['/s'], keep: ['q', 'pn'], isSearch: true },
  { hosts: ['zhihu.com'], paths: ['/search'], keep: ['q', 'type'], isSearch: true },
  {
    hosts: ['search.bilibili.com'],
    paths: ['/all', '/video'],
    keep: ['keyword', 'page'],
    isSearch: true,
  },
  { hosts: ['s.weibo.com'], paths: ['/weibo'], keep: ['q', 'page'], isSearch: true },
  { hosts: ['youtube.com'], paths: ['/results'], keep: ['search_query'], isSearch: true },
  // 同一个视频的各种带时间点/播放列表/来源参数的链接，指向的是同一个播放页
  { hosts: ['youtube.com'], paths: ['/watch'], keep: ['v'] },
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
