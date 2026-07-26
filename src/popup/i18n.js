const STORAGE_KEYS = Object.freeze({ uiLanguage: 'uiLanguage' });
const SUPPORTED_LANGUAGES = ['zh', 'en'];

const DICT = {
  zh: {
    appName: '链接预加载器',
    iconAlt: '图标',
    switchTheme: '切换主题',
    languageToggleTitle: '切换语言',
    tabSettings: '设置',
    tabStats: '统计',
    tabRules: '网站规则',
    enablePreload: '启用预加载',
    hoverDelay: '悬停延迟 (毫秒):',
    maxPreloads: '最大预加载数:',
    preloadMode: '预加载模式:',
    modeHiddenTab: '预加载窗口 (推荐)',
    modeIframe: 'iframe预加载',
    modeHiddenDesc: '预加载窗口：完整预加载，主窗口无干扰',
    modeIframeDesc: 'iframe预加载：轻量级，兼容性好',
    networkAware: '网络感知',
    networkAwareDesc: '自动检测网络状态，慢速网络时减少预加载',
    showIndicator: '显示预加载指示器',
    showIndicatorDesc: '在链接旁显示小圆点表示预加载状态',
    mutePreload: '预加载静音',
    mutePreloadDesc: '预加载标签页默认静音，避免视频/直播自动播放出声；激活后在地址栏点击可解除静音',
    smartTabDedup: '智能标签页去重与跳转',
    smartTabDedupDesc:
      '当前窗口已打开的网页不再重复打开，直接跳转到已有标签页；除点击链接外，window.open、书签、地址栏、外部应用打开的重复页也会被拦下。比对时忽略 www./尾斜杠/utm 等差异。中键与 Ctrl+点击（后台打开）不受影响',
    advancedFeatures: '高级功能',
    tabOutDesc: '开启后新标签页将显示 Tab-out 标签页管理面板，并启用标签数量徽章与收藏右键菜单',
    shortcutsEnabled: '启用快捷键 (Alt+P / Alt+C)',
    shortcutsDesc: 'Alt+P 开关预加载 | Alt+C 清理缓存。默认关闭，避免与系统或其它扩展冲突。',
    shortcutsDisabledDetail: '快捷键默认关闭；Alt+P / Alt+C 不会执行操作。',
    checkConflicts: '检测冲突',
    chromeShortcutSettings: 'Chrome 快捷键设置',
    statusInfo: '状态信息',
    currentStatus: '当前状态:',
    statusEnabled: '已启用',
    statusDisabled: '已禁用',
    preloadCount: '预加载计数:',
    currentPreloads: '当前预加载',
    noPreloads: '暂无预加载内容',
    nearbyLinks: '附近链接',
    noNearbyLinks: '暂无附近链接',
    clearCache: '清理缓存',
    settingsAutoSaved: '设置已自动保存',
    statsData: '统计数据',
    totalPreloads: '总预加载次数:',
    hitCount: '命中次数:',
    hitRate: '命中率:',
    savedTime: '节省时间:',
    sessionTime: '会话时长:',
    resetStats: '重置统计',
    siteRules: '网站规则',
    noSiteRules: '暂无网站规则',
    enableAll: '全部启用',
    disableAll: '全部禁用',
    deleteAll: '全部删除',
    addRule: '添加规则',
    shortcutFooterDisabled: '快捷键: 已关闭',
    loading: '加载中',
    loaded: '已加载',
    failed: '失败',
    preloadWindow: '预加载窗口',
    backgroundTab: '后台标签页',
    loadSettingsFailed: '加载设置失败',
    saving: '保存中...',
    autoSaved: '已自动保存',
    saveFailed: '保存失败',
    settingsSaved: '设置已保存',
    saveSettingsFailed: '保存设置失败',
    cacheCleared: '缓存已清理',
    clearCacheFailed: '清理缓存失败',
    shortcutUnassignedToast: '检测到快捷键未分配，可能与系统或其它扩展冲突',
    shortcutCustomizedToast: '快捷键可用，但与默认组合不同',
    shortcutOkToast: '快捷键无冲突，已正确分配',
    shortcutCheckFailed: '快捷键检测失败',
    shortcutToggleLabel: 'Alt+P 开关',
    shortcutClearLabel: 'Alt+C 清理',
    shortcutConflictStatus: '可能冲突或未分配：{missing}。请在 Chrome 快捷键设置中重新分配。',
    shortcutFooterConflict: '快捷键: 检测到冲突/未分配',
    shortcutCustomizedItem: '{label} 当前为 {actual}',
    shortcutCustomizedStatus: '快捷键已启用：{customized}。',
    shortcutFooterCustomized: '快捷键: {customized}',
    shortcutUnknownStatus: '暂时无法检测快捷键状态。',
    shortcutFooterUnknown: '快捷键: 状态未知',
    shortcutOkStatus: '快捷键已启用且无冲突：Alt+P 开关 | Alt+C 清理。',
    shortcutFooterOk: '快捷键: Alt+P 开关 | Alt+C 清理',
    enterRulePrompt: '请输入要禁用预加载的网站域名或网址，多个可用空格分隔（例如: baidu.com youku.com）:',
    invalidDomain: '未识别到有效域名',
    rulesAdded: '已禁用 {count} 个网站的预加载',
    addRuleFailed: '添加规则失败',
    ruleEnabledToast: '{domain} 已启用',
    ruleDisabledToast: '{domain} 已禁用',
    toggleRuleFailed: '切换规则状态失败',
    deleteRuleConfirm: '确定要删除 {domain} 的规则吗？',
    ruleDeleted: '规则已删除',
    deleteRuleFailed: '删除规则失败',
    noOperableRules: '没有可操作的规则',
    allRulesEnabled: '已启用所有规则 ({count}个)',
    allRulesDisabled: '已禁用所有规则 ({count}个)',
    batchOperationFailed: '批量操作失败',
    noDeletableRules: '没有可删除的规则',
    deleteAllConfirm: '确定要删除全部 {count} 条网站规则吗？',
    allRulesDeleted: '已删除全部规则 ({count}个)',
    deleteAllFailed: '全部删除失败',
    partialRuleAddFailed: '部分规则添加失败',
    partialRuleDeleteFailed: '部分规则删除失败',
    enabled: '已启用',
    disabled: '已禁用',
    enable: '启用',
    disable: '禁用',
    delete: '删除',
    resetStatsConfirm: '确定要重置统计数据吗？',
    statsReset: '统计数据已重置',
    resetStatsFailed: '重置统计失败',
    second: '秒',
    minute: '分钟',
    hour: '小时',
    minuteShort: '分',
    expand: '展开',
    collapse: '收起',
  },
  en: {
    appName: 'Link Preloader',
    iconAlt: 'Icon',
    switchTheme: 'Switch theme',
    languageToggleTitle: 'Switch language',
    tabSettings: 'Settings',
    tabStats: 'Stats',
    tabRules: 'Site Rules',
    enablePreload: 'Enable preloading',
    hoverDelay: 'Hover delay (ms):',
    maxPreloads: 'Max preloads:',
    preloadMode: 'Preload mode:',
    modeHiddenTab: 'Preload window (recommended)',
    modeIframe: 'iframe preload',
    modeHiddenDesc: 'Preload window: full preloading without disturbing the main window',
    modeIframeDesc: 'iframe preload: lightweight and broadly compatible',
    networkAware: 'Network aware',
    networkAwareDesc: 'Automatically detects network status and reduces preloads on slow networks',
    showIndicator: 'Show preload indicator',
    showIndicatorDesc: 'Show a small dot near links to indicate preload status',
    mutePreload: 'Mute preloaded tabs',
    mutePreloadDesc: 'Preloaded tabs are muted by default to avoid autoplay sound; unmute from the address bar after activation',
    smartTabDedup: 'Smart tab dedupe and jump',
    smartTabDedupDesc:
      'Jump to the tab that already has the page instead of opening a duplicate — covers link clicks plus window.open, bookmarks, the address bar and external apps. Ignores www., trailing slashes and utm-style params. Middle-click and Ctrl+click (background tabs) are left alone',
    advancedFeatures: 'Advanced features',
    tabOutDesc: 'When enabled, new tabs show the Tab-out tab manager, with tab count badge and favorite context menus',
    shortcutsEnabled: 'Enable shortcuts (Alt+P / Alt+C)',
    shortcutsDesc: 'Alt+P toggles preload | Alt+C clears cache. Disabled by default to avoid conflicts with the system or other extensions.',
    shortcutsDisabledDetail: 'Shortcuts are disabled by default; Alt+P / Alt+C will not run any action.',
    checkConflicts: 'Check conflicts',
    chromeShortcutSettings: 'Chrome shortcut settings',
    statusInfo: 'Status',
    currentStatus: 'Current status:',
    statusEnabled: 'Enabled',
    statusDisabled: 'Disabled',
    preloadCount: 'Preload count:',
    currentPreloads: 'Current preloads',
    noPreloads: 'No preloads yet',
    nearbyLinks: 'Nearby links',
    noNearbyLinks: 'No nearby links',
    clearCache: 'Clear cache',
    settingsAutoSaved: 'Settings auto-saved',
    statsData: 'Statistics',
    totalPreloads: 'Total preloads:',
    hitCount: 'Hits:',
    hitRate: 'Hit rate:',
    savedTime: 'Time saved:',
    sessionTime: 'Session time:',
    resetStats: 'Reset stats',
    siteRules: 'Site rules',
    noSiteRules: 'No site rules',
    enableAll: 'Enable all',
    disableAll: 'Disable all',
    deleteAll: 'Delete all',
    addRule: 'Add rule',
    shortcutFooterDisabled: 'Shortcuts: disabled',
    loading: 'Loading',
    loaded: 'Loaded',
    failed: 'Failed',
    preloadWindow: 'Preload window',
    backgroundTab: 'Background tab',
    loadSettingsFailed: 'Failed to load settings',
    saving: 'Saving...',
    autoSaved: 'Auto-saved',
    saveFailed: 'Save failed',
    settingsSaved: 'Settings saved',
    saveSettingsFailed: 'Failed to save settings',
    cacheCleared: 'Cache cleared',
    clearCacheFailed: 'Failed to clear cache',
    shortcutUnassignedToast: 'Some shortcuts are unassigned, possibly due to system or extension conflicts',
    shortcutCustomizedToast: 'Shortcuts are available but differ from the defaults',
    shortcutOkToast: 'Shortcuts are assigned correctly with no conflicts',
    shortcutCheckFailed: 'Shortcut check failed',
    shortcutToggleLabel: 'Alt+P toggle',
    shortcutClearLabel: 'Alt+C clear',
    shortcutConflictStatus: 'Possible conflict or unassigned: {missing}. Please reassign them in Chrome shortcut settings.',
    shortcutFooterConflict: 'Shortcuts: conflict/unassigned detected',
    shortcutCustomizedItem: '{label} is currently {actual}',
    shortcutCustomizedStatus: 'Shortcuts enabled: {customized}.',
    shortcutFooterCustomized: 'Shortcuts: {customized}',
    shortcutUnknownStatus: 'Unable to check shortcut status right now.',
    shortcutFooterUnknown: 'Shortcuts: unknown status',
    shortcutOkStatus: 'Shortcuts enabled with no conflicts: Alt+P toggle | Alt+C clear.',
    shortcutFooterOk: 'Shortcuts: Alt+P toggle | Alt+C clear',
    enterRulePrompt: 'Enter domains or URLs where preloading should be disabled. Separate multiple entries with spaces (e.g. baidu.com youku.com):',
    invalidDomain: 'No valid domain detected',
    rulesAdded: 'Disabled preloading for {count} site(s)',
    addRuleFailed: 'Failed to add rule',
    ruleEnabledToast: '{domain} enabled',
    ruleDisabledToast: '{domain} disabled',
    toggleRuleFailed: 'Failed to toggle rule status',
    deleteRuleConfirm: 'Delete the rule for {domain}?',
    ruleDeleted: 'Rule deleted',
    deleteRuleFailed: 'Failed to delete rule',
    noOperableRules: 'No rules to update',
    allRulesEnabled: 'Enabled all rules ({count})',
    allRulesDisabled: 'Disabled all rules ({count})',
    batchOperationFailed: 'Batch operation failed',
    noDeletableRules: 'No rules to delete',
    deleteAllConfirm: 'Delete all {count} site rule(s)?',
    allRulesDeleted: 'Deleted all rules ({count})',
    deleteAllFailed: 'Failed to delete all rules',
    partialRuleAddFailed: 'Failed to add some rules',
    partialRuleDeleteFailed: 'Failed to delete some rules',
    enabled: 'Enabled',
    disabled: 'Disabled',
    enable: 'Enable',
    disable: 'Disable',
    delete: 'Delete',
    resetStatsConfirm: 'Reset statistics?',
    statsReset: 'Statistics reset',
    resetStatsFailed: 'Failed to reset statistics',
    second: 's',
    minute: 'min',
    hour: 'h',
    minuteShort: 'm',
    expand: 'Expand',
    collapse: 'Collapse',
  },
};

let currentLanguage = 'en';

export async function initI18n() {
  const stored = await chrome.storage.sync.get(STORAGE_KEYS.uiLanguage);
  currentLanguage = normalizeLanguage(stored[STORAGE_KEYS.uiLanguage]) || detectBrowserLanguage();
  applyI18n();
  return currentLanguage;
}

export function getLanguage() {
  return currentLanguage;
}

export async function setLanguage(language) {
  currentLanguage = normalizeLanguage(language) || 'en';
  await chrome.storage.sync.set({ [STORAGE_KEYS.uiLanguage]: currentLanguage });
  applyI18n();
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: currentLanguage } }));
}

export async function toggleLanguage() {
  await setLanguage(currentLanguage === 'zh' ? 'en' : 'zh');
}

export function t(key, params = {}) {
  const template = DICT[currentLanguage]?.[key] ?? DICT.en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''));
}

export function applyI18n(root = document) {
  document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
  root.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-title]').forEach((node) => {
    node.title = t(node.dataset.i18nTitle);
  });
  root.querySelectorAll('[data-i18n-alt]').forEach((node) => {
    node.alt = t(node.dataset.i18nAlt);
  });
  root.querySelectorAll('[data-i18n-value]').forEach((node) => {
    node.value = t(node.dataset.i18nValue);
  });
  const languageToggle = document.getElementById('languageToggle');
  if (languageToggle) languageToggle.textContent = currentLanguage === 'zh' ? 'EN' : '中';
  const advancedToggle = document.getElementById('advancedFeaturesToggle');
  if (advancedToggle) {
    advancedToggle.dataset.i18nExpand = t('expand');
    advancedToggle.dataset.i18nCollapse = t('collapse');
  }
}

function detectBrowserLanguage() {
  return normalizeLanguage(chrome.i18n?.getUILanguage?.() || navigator.language) || 'en';
}

function normalizeLanguage(language) {
  if (!language) return '';
  const code = String(language).toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(code) ? code : '';
}
