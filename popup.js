// 链接预加载器 - Popup脚本 v2.0.0
class PopupManager {
  constructor() {
    this.elements = {};
    this.settings = {};
    this.stats = {};
    this.siteRules = {};
    this.currentTab = 'settings';
    this.saveTimer = null; // 防抖定时器
    this.init();
  }

  init() {
    this.initElements();
    this.loadSettings();
    this.loadStats();
    this.loadSiteRules();
    this.initTheme();
    this.attachEventListeners();
    this.updateStatus();
    this.setupTabs();
  }

  initElements() {
    this.elements = {
      enablePreload: document.getElementById('enablePreload'),
      hoverDelay: document.getElementById('hoverDelay'),
      hoverDelayValue: document.getElementById('hoverDelayValue'),
      maxPreloads: document.getElementById('maxPreloads'),
      maxPreloadsValue: document.getElementById('maxPreloadsValue'),
      preloadMode: document.getElementById('preloadMode'),
      networkAware: document.getElementById('networkAware'),
      showIndicator: document.getElementById('showIndicator'),
      currentStatus: document.getElementById('currentStatus'),
      preloadCount: document.getElementById('preloadCount'),
      preloadList: document.getElementById('preloadList'),
      nearbyList: document.getElementById('nearbyList'),
      clearCache: document.getElementById('clearCache'),
      saveSettings: document.getElementById('saveSettings'),
      themeToggle: document.getElementById('themeToggle'),
      totalPreloads: document.getElementById('totalPreloads'),
      hitCount: document.getElementById('hitCount'),
      hitRate: document.getElementById('hitRate'),
      savedTime: document.getElementById('savedTime'),
      sessionTime: document.getElementById('sessionTime'),
      resetStats: document.getElementById('resetStats'),
      rulesList: document.getElementById('rulesList'),
      addRule: document.getElementById('addRule'),
      enableAllRules: document.getElementById('enableAllRules'),
      disableAllRules: document.getElementById('disableAllRules')
    };
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response.success) {
        this.settings = response.settings;
        this.updateUI();
      }
    } catch (error) {
      console.error('加载设置失败:', error);
      this.showNotification('加载设置失败', 'error');
    }
  }

  async loadStats() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getStats' });
      if (response.success) {
        this.stats = response.stats;
        this.updateStats();
      }
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  }

  async loadSiteRules() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSiteRules' });
      if (response.success) {
        this.siteRules = response.rules || {};
        this.updateRulesList();
      }
    } catch (error) {
      console.error('加载网站规则失败:', error);
    }
  }

  initTheme() {
    // 检测系统主题
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = this.settings.darkMode || 'auto';
    
    if (savedTheme === 'auto') {
      document.body.classList.toggle('dark-mode', prefersDark);
    } else {
      document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    }

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.settings.darkMode === 'auto') {
        document.body.classList.toggle('dark-mode', e.matches);
      }
    });
  }

  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        
        // 更新按钮状态
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // 更新内容显示
        tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === `${targetTab}-tab`) {
            content.classList.add('active');
          }
        });

        this.currentTab = targetTab;

        // 切换到统计标签页时更新数据
        if (targetTab === 'stats') {
          this.loadStats();
        }
        // 切换到规则标签页时更新列表
        if (targetTab === 'rules') {
          this.loadSiteRules();
        }
      });
    });
  }

  updateUI() {
    this.elements.enablePreload.checked = this.settings.preloadEnabled;
    this.elements.hoverDelay.value = this.settings.hoverDelay;
    this.elements.hoverDelayValue.textContent = this.settings.hoverDelay;
    this.elements.maxPreloads.value = this.settings.maxPreloads;
    this.elements.maxPreloadsValue.textContent = this.settings.maxPreloads;
    this.elements.preloadMode.value = this.settings.preloadMode || 'hidden-tab';
    this.elements.networkAware.checked = this.settings.networkAware !== false;
    this.elements.showIndicator.checked = this.settings.showIndicator !== false;

    this.updateStatus();
  }

  updateStatus() {
    const isEnabled = this.elements.enablePreload.checked;
    this.elements.currentStatus.textContent = isEnabled ? '已启用' : '已禁用';
    this.elements.currentStatus.className = isEnabled ? 'status-enabled' : 'status-disabled';
  }

  updateStats() {
    const stats = this.stats;
    this.elements.totalPreloads.textContent = stats.totalPreloads || 0;
    this.elements.hitCount.textContent = stats.hitCount || 0;
    
    const hitRate = stats.totalPreloads > 0 
      ? ((stats.hitCount / stats.totalPreloads) * 100).toFixed(1)
      : 0;
    this.elements.hitRate.textContent = `${hitRate}%`;
    
    const savedTime = stats.savedTime || 0;
    if (savedTime > 1000) {
      this.elements.savedTime.textContent = `${(savedTime / 1000).toFixed(1)}秒`;
    } else {
      this.elements.savedTime.textContent = `${savedTime}ms`;
    }
    
    const sessionTime = stats.sessionStart 
      ? Math.floor((Date.now() - stats.sessionStart) / 60000)
      : 0;
    this.elements.sessionTime.textContent = `${sessionTime}分钟`;
  }

  updateRulesList() {
    const rulesList = this.elements.rulesList;
    const rules = this.siteRules;
    const domains = Object.keys(rules);

    if (domains.length === 0) {
      rulesList.innerHTML = '<div class="empty-message">暂无网站规则</div>';
      return;
    }

    rulesList.innerHTML = domains.map(domain => {
      const rule = rules[domain];
      return `
        <div class="rule-item">
          <div class="rule-domain">${domain}</div>
          <div class="rule-status ${rule.enabled ? 'enabled' : 'disabled'}">
            ${rule.enabled ? '已启用' : '已禁用'}
          </div>
          <div class="rule-actions">
            <button class="btn-toggle" data-domain="${domain}" data-enabled="${rule.enabled}">
              ${rule.enabled ? '禁用' : '启用'}
            </button>
            <button class="btn-remove" data-domain="${domain}">删除</button>
          </div>
        </div>
      `;
    }).join('');

    // 添加切换按钮事件
    rulesList.querySelectorAll('.btn-toggle').forEach(btn => {
      btn.addEventListener('click', async () => {
        const domain = btn.dataset.domain;
        const currentEnabled = btn.dataset.enabled === 'true';
        await this.toggleSiteRuleStatus(domain, !currentEnabled);
      });
    });

    // 添加删除按钮事件
    rulesList.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', async () => {
        const domain = btn.dataset.domain;
        await this.removeSiteRule(domain);
      });
    });
  }

  attachEventListeners() {
    // 启用/禁用开关 - 立即保存
    this.elements.enablePreload.addEventListener('change', () => {
      this.updateStatus();
      this.notifyContentScript();
      this.autoSaveSettings();
    });

    // 悬停延迟滑块 - 显示值，change时保存
    this.elements.hoverDelay.addEventListener('input', (e) => {
      this.elements.hoverDelayValue.textContent = e.target.value;
    });
    this.elements.hoverDelay.addEventListener('change', () => {
      this.autoSaveSettings();
    });

    // 最大预加载数滑块 - 显示值，change时保存
    this.elements.maxPreloads.addEventListener('input', (e) => {
      this.elements.maxPreloadsValue.textContent = e.target.value;
    });
    this.elements.maxPreloads.addEventListener('change', () => {
      this.autoSaveSettings();
    });

    // 预加载模式下拉框 - 立即保存
    this.elements.preloadMode.addEventListener('change', () => {
      this.autoSaveSettings();
    });

    // 网络感知开关 - 立即保存
    this.elements.networkAware.addEventListener('change', () => {
      this.autoSaveSettings();
    });

    // 显示指示器开关 - 立即保存
    this.elements.showIndicator.addEventListener('change', () => {
      this.autoSaveSettings();
    });

    // 清理缓存按钮
    this.elements.clearCache.addEventListener('click', () => {
      this.clearCache();
    });

    // 保存设置按钮 - 保留但显示已自动保存提示
    this.elements.saveSettings.addEventListener('click', () => {
      this.saveSettings(true);
    });

    // 主题切换按钮
    this.elements.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    // 重置统计按钮
    this.elements.resetStats.addEventListener('click', () => {
      this.resetStats();
    });

    // 添加规则按钮
    this.elements.addRule.addEventListener('click', () => {
      this.showAddRuleDialog();
    });

    // 全部启用按钮
    this.elements.enableAllRules.addEventListener('click', () => {
      this.setAllRulesStatus(true);
    });

    // 全部禁用按钮
    this.elements.disableAllRules.addEventListener('click', () => {
      this.setAllRulesStatus(false);
    });

    // 实时更新预加载信息
    setInterval(() => {
      this.updatePreloadInfo();
    }, 1000);
  }

  async notifyContentScript() {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'togglePreload',
          enabled: this.elements.enablePreload.checked
        }).catch(() => {
          // 忽略无法发送消息的情况
        });
      }
    } catch (error) {
      console.error('通知内容脚本失败:', error);
    }
  }

  // 自动保存设置（带防抖）
  autoSaveSettings() {
    // 清除之前的定时器
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }

    // 显示保存中状态
    const saveBtn = this.elements.saveSettings;
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '保存中...';
    saveBtn.disabled = true;

    // 设置新的定时器，300ms后保存
    this.saveTimer = setTimeout(async () => {
      await this.saveSettings(false); // false表示不显示通知
      saveBtn.textContent = '已自动保存';
      saveBtn.disabled = false;
      
      // 显示通知提示
      this.showNotification('设置已自动保存', 'success');
      
      // 1秒后恢复原文本
      setTimeout(() => {
        saveBtn.textContent = originalText;
      }, 1000);
    }, 300);
  }

  async saveSettings(showNotification = true) {
    try {
      const newSettings = {
        preloadEnabled: this.elements.enablePreload.checked,
        hoverDelay: parseInt(this.elements.hoverDelay.value),
        maxPreloads: parseInt(this.elements.maxPreloads.value),
        preloadMode: this.elements.preloadMode.value,
        networkAware: this.elements.networkAware.checked,
        showIndicator: this.elements.showIndicator.checked,
        darkMode: this.settings.darkMode || 'auto'
      };

      const response = await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: newSettings
      });

      if (response.success) {
        this.settings = { ...this.settings, ...newSettings };
        if (showNotification) {
          this.showNotification('设置已保存', 'success');
        }
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('保存设置失败:', error);
      if (showNotification) {
        this.showNotification('保存设置失败', 'error');
      }
    }
  }

  async clearCache() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'clearPreloads' });
      if (response.success) {
        this.showNotification('缓存已清理', 'success');
        this.elements.preloadCount.textContent = '0';
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('清理缓存失败:', error);
      this.showNotification('清理缓存失败', 'error');
    }
  }

  async resetStats() {
    if (!confirm('确定要重置统计数据吗？')) {
      return;
    }

    try {
      const response = await chrome.runtime.sendMessage({ action: 'resetStats' });
      if (response.success) {
        this.loadStats();
        this.showNotification('统计数据已重置', 'success');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('重置统计失败:', error);
      this.showNotification('重置统计失败', 'error');
    }
  }

  toggleTheme() {
    const currentTheme = this.settings.darkMode || 'auto';
    let newTheme;

    if (currentTheme === 'auto') {
      newTheme = 'dark';
    } else if (currentTheme === 'dark') {
      newTheme = 'light';
    } else {
      newTheme = 'auto';
    }

    this.settings.darkMode = newTheme;
    
    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('dark-mode', prefersDark);
    } else {
      document.body.classList.toggle('dark-mode', newTheme === 'dark');
    }

    // 保存主题设置
    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: { darkMode: newTheme }
    }).catch(() => {});
  }

  async showAddRuleDialog() {
    const domain = prompt('请输入要禁用预加载的网站域名（例如: baidu.com）:');
    if (!domain) return;

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'updateSiteRule',
        domain: domain,
        rule: { enabled: false }  // 添加规则默认为禁用预加载
      });

      if (response.success) {
        await this.loadSiteRules();
        this.showNotification(`已禁用 ${domain} 的预加载`, 'success');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('添加规则失败:', error);
      this.showNotification('添加规则失败', 'error');
    }
  }

  async toggleSiteRuleStatus(domain, enabled) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'updateSiteRule',
        domain: domain,
        rule: { enabled: enabled }
      });

      if (response.success) {
        await this.loadSiteRules();
        this.showNotification(`${domain} 已${enabled ? '启用' : '禁用'}`, 'success');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('切换规则状态失败:', error);
      this.showNotification('切换规则状态失败', 'error');
    }
  }

  async removeSiteRule(domain) {
    if (!confirm(`确定要删除 ${domain} 的规则吗？`)) {
      return;
    }

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'updateSiteRule',
        domain: domain,
        rule: null
      });

      if (response.success) {
        await this.loadSiteRules();
        this.showNotification('规则已删除', 'success');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('删除规则失败:', error);
      this.showNotification('删除规则失败', 'error');
    }
  }

  async setAllRulesStatus(enabled) {
    const domains = Object.keys(this.siteRules);
    if (domains.length === 0) {
      this.showNotification('没有可操作的规则', 'info');
      return;
    }

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'setAllRulesStatus',
        enabled: enabled
      });

      if (response.success) {
        await this.loadSiteRules();
        this.showNotification(`已${enabled ? '启用' : '禁用'}所有规则 (${domains.length}个)`, 'success');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('批量操作失败:', error);
      this.showNotification('批量操作失败', 'error');
    }
  }

  async updatePreloadInfo() {
    try {
      // 获取当前活动标签页
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs[0]) return;

      const response = await chrome.runtime.sendMessage({
        action: 'getCurrentPreloads',
        tabId: tabs[0].id
      });

      if (response.success && response.data) {
        this.displayPreloadInfo(response.data);
      }
    } catch (error) {
      console.error('获取预加载信息失败:', error);
    }
  }

  displayPreloadInfo(data) {
    const { preloads, nearbyLinks } = data;

    // 更新预加载计数
    this.elements.preloadCount.textContent = preloads.length;

    // 显示预加载列表
    this.displayPreloadList(preloads);

    // 显示附近链接
    this.displayNearbyLinks(nearbyLinks);
  }

  displayPreloadList(preloads) {
    const container = this.elements.preloadList;

    if (preloads.length === 0) {
      container.innerHTML = '<div class="empty-message">暂无预加载内容</div>';
      return;
    }

    container.innerHTML = preloads.map(preload => `
      <div class="preload-item ${preload.status}">
        <div class="item-title">${this.truncateText(preload.title, 40)}</div>
        <div class="item-url">${this.truncateText(preload.href, 50)}</div>
        <div class="item-meta">
          <span class="item-status ${preload.status}">${this.getStatusText(preload.status)}</span>
          <span class="item-type">${this.getTypeText(preload.type)}</span>
          ${preload.tabId ? `<span class="item-tab-id">Tab:${preload.tabId}</span>` : ''}
        </div>
      </div>
    `).join('');
  }

  displayNearbyLinks(nearbyLinks) {
    const container = this.elements.nearbyList;

    if (nearbyLinks.length === 0) {
      container.innerHTML = '<div class="empty-message">暂无附近链接</div>';
      return;
    }

    container.innerHTML = nearbyLinks.map(link => `
      <div class="nearby-item">
        <div class="item-title">${this.truncateText(link.title, 40)}</div>
        <div class="item-url">${this.truncateText(link.href, 50)}</div>
        <div class="item-meta">
          <span class="item-distance">${link.distance}px</span>
        </div>
      </div>
    `).join('');
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  getStatusText(status) {
    const statusMap = {
      'loading': '加载中',
      'loaded': '已加载',
      'failed': '失败'
    };
    return statusMap[status] || status;
  }

  getTypeText(type) {
    const typeMap = {
      'preload-window': '预加载窗口',
      'background-tab': '后台标签页',
      'iframe': 'iframe',
      'prefetch': 'prefetch'
    };
    return typeMap[type] || type;
  }

  showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 8px 12px;
      border-radius: 4px;
      color: white;
      font-size: 12px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;

    if (type === 'success') {
      notification.style.backgroundColor = '#34a853';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#ea4335';
    } else {
      notification.style.backgroundColor = '#1a73e8';
    }

    document.body.appendChild(notification);

    // 3秒后自动移除
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
