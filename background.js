// 链接预加载器 - 后台脚本 (Service Worker) v2.0.0

class PreloadManager {
  constructor() {
    this.preloadCache = new Map();
    this.currentPreloads = new Map(); // 存储当前标签页的预加载信息
    this.nearbyLinks = new Map(); // 存储附近链接信息
    this.backgroundTabs = new Map(); // 存储后台预加载标签页 URL -> TabID
    this.tabUrls = new Map(); // 存储标签页ID -> URL的映射
    this.preloadWindowId = null; // 预加载窗口ID
    this.preloadedTabIds = new Set(); // 预加载的标签页ID集合
    
    // 新增：统计数据
    this.stats = {
      totalPreloads: 0,
      hitCount: 0,
      missCount: 0,
      savedTime: 0,
      sessionStart: Date.now()
    };
    
    // 新增：网站规则
    this.siteRules = new Map(); // domain -> { enabled: boolean, maxPreloads: number }
    
    this.init();
  }

  async init() {
    // 先加载统计数据和网站规则（等待完成）
    await this.loadStats();
    await this.loadSiteRules();
    
    console.log('=== 预加载管理器初始化完成 ===');
    console.log('已加载规则数量:', this.siteRules.size);
    if (this.siteRules.size > 0) {
      console.log('规则列表:', Array.from(this.siteRules.keys()));
    }
    
    // 监听扩展安装
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        this.setDefaultSettings();
      }
      this.setupContextMenu();
    });

    // 监听来自content script和popup的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // 保持消息通道开放
    });

    // 监听标签页更新
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.cleanupOldPreloads();
      }
    });

    // 监听标签页关闭
    chrome.tabs.onRemoved.addListener((tabId) => {
      this.cleanupTabPreloads(tabId);
      // 清理后台标签页记录
      const url = this.tabUrls.get(tabId);
      if (url) {
        this.backgroundTabs.delete(url);
        this.tabUrls.delete(tabId);
        console.log(`清理关闭的后台标签页记录: TabID ${tabId}, URL: ${url}`);
      }
      this.preloadedTabIds.delete(tabId);

      // 通知所有content script标签页已关闭
      this.notifyTabClosed(tabId);
    });

    // 新增：监听快捷键
    chrome.commands.onCommand.addListener((command) => {
      this.handleCommand(command);
    });

    // 新增：监听右键菜单
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      this.handleContextMenu(info, tab);
    });
  }

  setupContextMenu() {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'preload-link',
        title: '预加载此链接',
        contexts: ['link']
      });
      chrome.contextMenus.create({
        id: 'toggle-site',
        title: '在此网站启用/禁用预加载',
        contexts: ['page']
      });
    });
  }

  async handleCommand(command) {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) return;

    switch (command) {
      case 'toggle-preload':
        const settings = await this.getSettings();
        const newEnabled = !settings.preloadEnabled;
        await this.updateSettings({ preloadEnabled: newEnabled });
        this.broadcastSettingsUpdate({ preloadEnabled: newEnabled });
        break;
      case 'clear-cache':
        this.clearAllPreloads();
        break;
    }
  }

  async handleContextMenu(info, tab) {
    switch (info.menuItemId) {
      case 'preload-link':
        if (info.linkUrl) {
          await this.createBackgroundTab(info.linkUrl, () => {}, tab.id);
        }
        break;
      case 'toggle-site':
        if (tab.url) {
          await this.toggleSiteRule(tab.url);
        }
        break;
    }
  }

  async setDefaultSettings() {
    const defaultSettings = {
      preloadEnabled: true,
      hoverDelay: 100,
      maxPreloads: 5,
      preloadTimeout: 30000,
      preloadMode: 'hidden-tab',
      darkMode: 'auto',
      networkAware: true,
      showIndicator: true
    };

    try {
      await chrome.storage.sync.set(defaultSettings);
      console.log('默认设置已保存');
    } catch (error) {
      console.error('保存默认设置失败:', error);
    }
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'getSettings':
          const settings = await this.getSettings();
          sendResponse({ success: true, settings });
          break;

        case 'updateSettings':
          await this.updateSettings(request.settings);
          // 通知所有标签页设置已更新
          this.broadcastSettingsUpdate(request.settings);
          sendResponse({ success: true });
          break;

        case 'preloadLink':
          await this.preloadLink(request.url, sender.tab.id);
          sendResponse({ success: true });
          break;

        case 'getPreloadStatus':
          const status = this.getPreloadStatus(request.url);
          sendResponse({ success: true, status });
          break;

        case 'clearPreloads':
          this.clearAllPreloads();
          sendResponse({ success: true });
          break;

        case 'updatePreloadList':
          this.updatePreloadList(request.preloads, request.nearbyLinks, sender.tab.id);
          sendResponse({ success: true });
          break;

        case 'getCurrentPreloads':
          const tabId = request.tabId || sender.tab?.id;
          const currentData = this.getCurrentPreloads(tabId);
          sendResponse({ success: true, data: currentData });
          break;

        case 'ping':
          sendResponse({ success: true, message: 'pong' });
          break;

        case 'createBackgroundTab':
          this.createBackgroundTab(request.url, sendResponse);
          return true; // 保持异步响应

        case 'activateTab':
          this.activateTab(request.tabId, sendResponse);
          return true; // 保持异步响应

        case 'closeTab':
          this.closeTab(request.tabId, sendResponse);
          return true; // 保持异步响应

        case 'getStats':
          sendResponse({ success: true, stats: this.stats });
          break;

        case 'recordHit':
          this.recordHit(request.savedTime);
          sendResponse({ success: true });
          break;

        case 'resetStats':
          this.resetStats();
          sendResponse({ success: true });
          break;

        case 'getSiteRules':
          const rules = Object.fromEntries(this.siteRules);
          sendResponse({ success: true, rules });
          break;

        case 'updateSiteRule':
          await this.updateSiteRule(request.domain, request.rule);
          sendResponse({ success: true });
          break;

        case 'setAllRulesStatus':
          await this.setAllRulesStatus(request.enabled);
          sendResponse({ success: true });
          break;

        case 'checkSiteEnabled':
          const enabled = this.isSiteEnabled(request.url);
          sendResponse({ success: true, enabled });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('处理消息时出错:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async getSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'preloadEnabled',
        'hoverDelay',
        'maxPreloads',
        'preloadTimeout',
        'preloadMode',
        'darkMode',
        'networkAware',
        'showIndicator'
      ]);

      return {
        preloadEnabled: result.preloadEnabled !== false,
        hoverDelay: result.hoverDelay || 100,
        maxPreloads: result.maxPreloads || 5,
        preloadTimeout: result.preloadTimeout || 30000,
        preloadMode: result.preloadMode || 'hidden-tab',
        darkMode: result.darkMode || 'auto',
        networkAware: result.networkAware !== false,
        showIndicator: result.showIndicator !== false
      };
    } catch (error) {
      console.error('获取设置失败:', error);
      return {
        preloadEnabled: true,
        hoverDelay: 100,
        maxPreloads: 5,
        preloadTimeout: 30000,
        darkMode: 'auto',
        networkAware: true,
        showIndicator: true
      };
    }
  }

  async updateSettings(newSettings) {
    try {
      await chrome.storage.sync.set(newSettings);
      console.log('设置已更新:', newSettings);
    } catch (error) {
      console.error('更新设置失败:', error);
      throw error;
    }
  }

  async broadcastSettingsUpdate(settings) {
    try {
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'settingsUpdated',
            settings: settings
          }).catch(() => {
            // 忽略无法发送消息的标签页
          });
        }
      }
    } catch (error) {
      console.error('广播设置更新失败:', error);
    }
  }

  async preloadLink(url, tabId) {
    try {
      // 检查URL是否有效
      if (!this.isValidUrl(url)) {
        throw new Error('无效的URL');
      }

      // 检查是否已经在预加载
      const cacheKey = `${tabId}-${url}`;
      if (this.preloadCache.has(cacheKey)) {
        return;
      }

      // 标记为预加载中
      this.preloadCache.set(cacheKey, {
        status: 'loading',
        timestamp: Date.now(),
        tabId: tabId,
        url: url
      });

      // 使用fetch预加载资源
      const response = await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'force-cache'
      });

      // 更新缓存状态
      this.preloadCache.set(cacheKey, {
        status: 'loaded',
        timestamp: Date.now(),
        tabId: tabId,
        url: url,
        response: response
      });

      this.stats.totalPreloads++;
      this.saveStats();
      console.log(`预加载完成: ${url}`);

    } catch (error) {
      console.error(`预加载失败 ${url}:`, error);
      const cacheKey = `${tabId}-${url}`;
      this.preloadCache.delete(cacheKey);
    }
  }

  isValidUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  getPreloadStatus(url) {
    for (const [key, data] of this.preloadCache) {
      if (data.url === url) {
        return data.status;
      }
    }
    return 'not_preloaded';
  }

  cleanupOldPreloads() {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5分钟

    for (const [key, data] of this.preloadCache) {
      if (now - data.timestamp > maxAge) {
        this.preloadCache.delete(key);
      }
    }
  }

  cleanupTabPreloads(tabId) {
    for (const [key, data] of this.preloadCache) {
      if (data.tabId === tabId) {
        this.preloadCache.delete(key);
      }
    }
  }

  updatePreloadList(preloads, nearbyLinks, tabId) {
    console.log(`更新标签页 ${tabId} 的预加载信息:`, { preloads: preloads?.length, nearbyLinks: nearbyLinks?.length });
    this.currentPreloads.set(tabId, preloads || []);
    this.nearbyLinks.set(tabId, nearbyLinks || []);
  }

  getCurrentPreloads(tabId) {
    const data = {
      preloads: this.currentPreloads.get(tabId) || [],
      nearbyLinks: this.nearbyLinks.get(tabId) || []
    };
    console.log(`获取标签页 ${tabId} 的预加载信息:`, data);
    return data;
  }

  async createBackgroundTab(url, sendResponse, sourceTabId = null) {
    try {
      // 检查网站规则
      if (!this.isSiteEnabled(url)) {
        console.log(`🚫 网站已禁用预加载: ${url}`);
        if (typeof sendResponse === 'function') {
          sendResponse({ success: false, error: '该网站已禁用预加载' });
        }
        return;
      }

      // 检查是否已经有这个URL的后台标签页
      if (this.backgroundTabs.has(url)) {
        const existingTabId = this.backgroundTabs.get(url);
        console.log(`♻️ 发现已存在的标签页: ${existingTabId}`);
        // 验证标签页是否仍然存在
        try {
          await chrome.tabs.get(existingTabId);
          console.log(`✅ 复用已存在的标签页: ${existingTabId}`);
          if (typeof sendResponse === 'function') {
            sendResponse({ success: true, tabId: existingTabId });
          }
          return;
        } catch {
          // 标签页不存在，清理记录
          console.log(`🧹 清理无效的标签页记录: ${existingTabId}`);
          this.backgroundTabs.delete(url);
          this.tabUrls.delete(existingTabId);
          this.preloadedTabIds.delete(existingTabId);
        }
      }

      // 确保预加载窗口存在
      await this.ensurePreloadWindow();
      console.log(`🔍 预加载窗口ID: ${this.preloadWindowId}`);

      // 验证预加载窗口是否真的存在
      try {
        const preloadWindow = await chrome.windows.get(this.preloadWindowId);
        console.log(`✅ 预加载窗口验证成功:`, preloadWindow);
      } catch (error) {
        console.error(`❌ 预加载窗口验证失败:`, error);
        throw new Error('预加载窗口不存在');
      }

      // 在预加载窗口中创建标签页
      console.log(`📄 在预加载窗口 ${this.preloadWindowId} 中创建标签页...`);
      const tab = await chrome.tabs.create({
        url: url,
        windowId: this.preloadWindowId,
        active: false // 不激活
      });

      console.log(`📋 标签页创建结果: TabID ${tab.id}, WindowID ${tab.windowId}`);

      // 验证标签页是否真的在预加载窗口中
      if (tab.windowId !== this.preloadWindowId) {
        console.error(`❌ 标签页创建在错误的窗口! 预期: ${this.preloadWindowId}, 实际: ${tab.windowId}`);
        // 尝试移动标签页到正确的窗口
        try {
          await chrome.tabs.move(tab.id, {
            windowId: this.preloadWindowId,
            index: -1
          });
          console.log(`✅ 标签页已移动到预加载窗口: ${this.preloadWindowId}`);
        } catch (moveError) {
          console.error(`❌ 移动标签页失败:`, moveError);
        }
      } else {
        console.log(`✅ 标签页正确创建在预加载窗口中`);
      }

      // 记录标签页信息
      this.backgroundTabs.set(url, tab.id);
      this.tabUrls.set(tab.id, url);
      this.preloadedTabIds.add(tab.id);
      this.stats.totalPreloads++;
      this.saveStats();

      console.log(`✅ 预加载窗口标签页创建成功: ${url}, TabID: ${tab.id}, WindowID: ${this.preloadWindowId}`);
      if (typeof sendResponse === 'function') {
        sendResponse({ success: true, tabId: tab.id });
      }

    } catch (error) {
      console.error(`❌ 创建预加载窗口标签页失败: ${url}`, error);
      if (typeof sendResponse === 'function') {
        sendResponse({ success: false, error: error.message });
      }
    }
  }

  async ensurePreloadWindow() {
    // 如果预加载窗口不存在或已关闭，创建新的
    if (!this.preloadWindowId) {
      console.log('🔄 预加载窗口不存在，创建新窗口...');
      await this.createPreloadWindow();
      return;
    }

    try {
      // 检查窗口是否仍然存在
      const window = await chrome.windows.get(this.preloadWindowId);
      console.log(`✅ 预加载窗口存在: WindowID ${this.preloadWindowId}`, window);
    } catch (error) {
      // 窗口不存在，创建新的
      console.log(`❌ 预加载窗口不存在，重新创建: ${error.message}`);
      this.preloadWindowId = null;
      await this.createPreloadWindow();
    }
  }

  async createPreloadWindow() {
    try {
      console.log('🏗️ 创建预加载窗口...');

      // 获取屏幕信息
      const currentWindow = await chrome.windows.getCurrent();

      // 创建一个normal类型的小窗口在屏幕角落
      const window = await chrome.windows.create({
        url: 'about:blank',
        type: 'normal', // 改为normal类型，允许标签页移动
        width: 300,
        height: 200,
        left: 0, // 屏幕左上角
        top: 0,
        focused: false
      });

      this.preloadWindowId = window.id;
      console.log(`✅ 预加载窗口创建成功: WindowID ${this.preloadWindowId}`);
      console.log(`📊 窗口详细信息:`, window);

      // 立即最小化窗口
      setTimeout(async () => {
        try {
          await chrome.windows.update(this.preloadWindowId, {
            state: 'minimized'
          });
          console.log(`✅ 预加载窗口已最小化: WindowID ${this.preloadWindowId}`);

          // 验证窗口状态
          const updatedWindow = await chrome.windows.get(this.preloadWindowId);
          console.log(`📊 最小化后窗口状态:`, updatedWindow);
        } catch (minimizeError) {
          console.log(`⚠️ 最小化失败，窗口保持在角落: ${minimizeError.message}`);
        }
      }, 100);

      // 监听窗口关闭事件
      chrome.windows.onRemoved.addListener((windowId) => {
        if (windowId === this.preloadWindowId) {
          this.preloadWindowId = null;
          console.log('预加载窗口已关闭');
        }
      });

    } catch (error) {
      console.error('❌ 创建预加载窗口失败:', error);
      throw error;
    }
  }

  async activateTab(tabId, sendResponse) {
    try {
      // 获取当前活动窗口
      const currentWindow = await chrome.windows.getCurrent();

      // 将标签页从预加载窗口移动到当前窗口
      await chrome.tabs.move(tabId, {
        windowId: currentWindow.id,
        index: -1 // 移到最后
      });

      // 激活标签页
      await chrome.tabs.update(tabId, { active: true });

      // 确保窗口获得焦点
      await chrome.windows.update(currentWindow.id, { focused: true });

      this.preloadedTabIds.delete(tabId);
      this.stats.hitCount++;
      this.saveStats();

      console.log(`✅ 标签页已从预加载窗口移动到主窗口并激活: TabID ${tabId}`);
      sendResponse({ success: true });

    } catch (error) {
      console.error('❌ 激活标签页失败:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async closeTab(tabId, sendResponse) {
    try {
      // 关闭指定的标签页
      await chrome.tabs.remove(tabId);

      // 清理记录
      const url = this.tabUrls.get(tabId);
      if (url) {
        this.backgroundTabs.delete(url);
        this.tabUrls.delete(tabId);
      }
      this.preloadedTabIds.delete(tabId);

      console.log(`关闭标签页: TabID ${tabId}`);
      if (typeof sendResponse === 'function') {
        sendResponse({ success: true });
      }

    } catch (error) {
      console.error('关闭标签页失败:', error);
      if (typeof sendResponse === 'function') {
        sendResponse({ success: false, error: error.message });
      }
    }
  }

  async notifyTabClosed(tabId) {
    try {
      // 获取所有标签页
      const tabs = await chrome.tabs.query({});

      // 向每个标签页的content script发送标签页关闭通知
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'tabClosed',
            tabId: tabId
          });
        } catch (error) {
          // 忽略发送失败的情况（可能是没有content script的页面）
        }
      }
    } catch (error) {
      console.error('通知标签页关闭失败:', error);
    }
  }

  clearAllPreloads() {
    // 关闭预加载窗口（会自动关闭其中的所有标签页）
    if (this.preloadWindowId) {
      chrome.windows.remove(this.preloadWindowId).catch(() => {
        // 忽略关闭失败的情况
      });
      this.preloadWindowId = null;
    }

    this.preloadCache.clear();
    this.currentPreloads.clear();
    this.nearbyLinks.clear();
    this.backgroundTabs.clear();
    this.tabUrls.clear();
    this.preloadedTabIds.clear();
    console.log('所有预加载缓存已清理，预加载窗口已关闭');
  }

  // 统计功能
  async loadStats() {
    try {
      const result = await chrome.storage.local.get(['preloadStats']);
      if (result.preloadStats) {
        this.stats = { ...this.stats, ...result.preloadStats };
      }
    } catch (error) {}
  }

  async saveStats() {
    try {
      await chrome.storage.local.set({ preloadStats: this.stats });
    } catch (error) {}
  }

  recordHit(savedTime = 0) {
    this.stats.hitCount++;
    this.stats.savedTime += savedTime;
    this.saveStats();
  }

  resetStats() {
    this.stats = {
      totalPreloads: 0,
      hitCount: 0,
      missCount: 0,
      savedTime: 0,
      sessionStart: Date.now()
    };
    this.saveStats();
  }

  // 网站规则功能
  async loadSiteRules() {
    try {
      const result = await chrome.storage.sync.get(['siteRules']);
      if (result.siteRules) {
        this.siteRules = new Map(Object.entries(result.siteRules));
        console.log('网站规则已加载:', Object.keys(result.siteRules));
      } else {
        console.log('没有找到网站规则');
      }
    } catch (error) {
      console.error('加载网站规则失败:', error);
    }
  }

  async saveSiteRules() {
    try {
      const rules = Object.fromEntries(this.siteRules);
      await chrome.storage.sync.set({ siteRules: rules });
      console.log('网站规则已保存:', Object.keys(rules));
    } catch (error) {
      console.error('保存网站规则失败:', error);
    }
  }

  isSiteEnabled(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      console.log(`检查网站规则 - 完整域名: ${hostname}`);
      console.log(`当前规则列表:`, Array.from(this.siteRules.keys()));
      
      // 1. 先精确匹配完整域名
      let rule = this.siteRules.get(hostname);
      if (rule) {
        console.log(`精确匹配到规则: ${hostname} -> ${rule.enabled ? '启用' : '禁用'}`);
        if (rule.enabled === false) {
          return false;
        }
        return true;
      }
      
      // 2. 如果域名以 www. 开头，尝试匹配不带 www 的域名
      if (hostname.startsWith('www.')) {
        const domainWithoutWww = hostname.substring(4);
        rule = this.siteRules.get(domainWithoutWww);
        if (rule) {
          console.log(`匹配到规则(去www): ${domainWithoutWww} -> ${rule.enabled ? '启用' : '禁用'}`);
          if (rule.enabled === false) {
            return false;
          }
          return true;
        }
      }
      
      // 3. 如果域名不以 www. 开头，尝试匹配带 www 的域名
      if (!hostname.startsWith('www.')) {
        const domainWithWww = 'www.' + hostname;
        rule = this.siteRules.get(domainWithWww);
        if (rule) {
          console.log(`匹配到规则(加www): ${domainWithWww} -> ${rule.enabled ? '启用' : '禁用'}`);
          if (rule.enabled === false) {
            return false;
          }
          return true;
        }
      }
      
      // 4. 尝试匹配主域名（去掉子域名）
      const parts = hostname.split('.');
      if (parts.length > 2) {
        const mainDomain = parts.slice(-2).join('.');
        rule = this.siteRules.get(mainDomain);
        if (rule) {
          console.log(`匹配到规则(主域名): ${mainDomain} -> ${rule.enabled ? '启用' : '禁用'}`);
          if (rule.enabled === false) {
            return false;
          }
          return true;
        }
      }
      
      // 没有匹配到任何规则，默认启用
      console.log(`网站规则检查: ${hostname} - 无匹配规则，默认启用`);
      return true;
    } catch (error) {
      console.error('解析URL失败:', error);
      return true;
    }
  }

  async toggleSiteRule(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const currentRule = this.siteRules.get(domain) || { enabled: true };
      currentRule.enabled = !currentRule.enabled;
      this.siteRules.set(domain, currentRule);
      await this.saveSiteRules();
      
      console.log(`网站规则已切换: ${domain} - ${currentRule.enabled ? '启用' : '禁用'}`);
      
      // 通知用户
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'siteRuleChanged',
          domain: domain,
          enabled: currentRule.enabled
        }).catch(() => {});
      }
    } catch (error) {
      console.error('切换网站规则失败:', error);
    }
  }

  async updateSiteRule(domain, rule) {
    if (rule === null) {
      this.siteRules.delete(domain);
      console.log(`网站规则已删除: ${domain}`);
    } else {
      this.siteRules.set(domain, rule);
      console.log(`网站规则已更新: ${domain} - ${rule.enabled ? '启用' : '禁用'}`);
    }
    await this.saveSiteRules();
  }

  async setAllRulesStatus(enabled) {
    const count = this.siteRules.size;
    if (count === 0) {
      console.log('没有规则需要更新');
      return;
    }

    for (const [domain, rule] of this.siteRules) {
      rule.enabled = enabled;
    }
    
    await this.saveSiteRules();
    console.log(`已${enabled ? '启用' : '禁用'}所有规则 (${count}个)`);
  }
}

// 初始化预加载管理器
const preloadManager = new PreloadManager();
