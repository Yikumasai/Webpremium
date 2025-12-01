// 链接预加载器 - 内容脚本 v2.0.0
class LinkPreloader {
  constructor() {
    this.preloadedLinks = new Map();
    this.preloadFrames = new Map();
    this.isEnabled = true;
    this.hoverDelay = 100; // 鼠标悬停延迟时间（毫秒）
    this.maxPreloads = 5; // 最大同时预加载数量
    this.hoverTimer = null;
    this.mousePosition = { x: 0, y: 0 };
    this.nearbyLinks = [];
    this.updateTimer = null;
    this.preloadingUrls = new Set(); // 正在预加载的URL集合，防止重复
    this.activatedTabs = new Set(); // 用户已激活的标签页ID，不应被清理
    this.networkAware = true; // 网络感知
    this.showIndicator = true; // 显示指示器
    this.indicatorStyle = null; // 指示器样式

    // 视频网站域名列表
    this.videoSites = [
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'dailymotion.com',
      'twitch.tv',
      'bilibili.com',
      'iqiyi.com',
      'youku.com',
      'tencent.com'
    ];

    // 绑定事件处理器，以便可以正确添加和移除
    this.boundHandleMouseOver = this.handleMouseOver.bind(this);
    this.boundHandleMouseOut = this.handleMouseOut.bind(this);
    this.boundHandleClick = this.handleClick.bind(this);
    this.boundHandleMouseMove = this.handleMouseMove.bind(this);

    this.init();
  }

  async init() {
    // 从存储中获取设置
    try {
      const result = await chrome.storage.sync.get(['preloadEnabled', 'hoverDelay', 'maxPreloads', 'preloadMode', 'networkAware', 'showIndicator']);
      this.isEnabled = result.preloadEnabled !== false;
      this.hoverDelay = result.hoverDelay || 100;
      this.maxPreloads = result.maxPreloads || 5;
      this.preloadMode = result.preloadMode || 'hidden-tab';
      this.networkAware = result.networkAware !== false;
      this.showIndicator = result.showIndicator !== false;
    } catch (error) {
      console.log('使用默认设置');
    }

    if (this.showIndicator) {
      this.injectIndicatorStyles();
    }

    // 检查当前网站是否启用预加载
    console.log('=== 链接预加载器初始化 ===');
    console.log('当前页面:', window.location.href);
    console.log('域名:', window.location.hostname);
    console.log('全局启用状态:', this.isEnabled);
    
    if (this.isEnabled) {
      try {
        console.log('正在检查网站规则...');
        const response = await chrome.runtime.sendMessage({
          action: 'checkSiteEnabled',
          url: window.location.href
        });
        console.log('规则检查响应:', response);
        
        if (response && response.success && response.enabled === false) {
          console.log(`🚫 当前网站已禁用预加载: ${window.location.hostname}`);
          this.isEnabled = false;
        } else if (response && response.success && response.enabled === true) {
          console.log(`✅ 当前网站已启用预加载: ${window.location.hostname}`);
          this.attachEventListeners();
        } else {
          console.warn('规则检查响应异常:', response);
          this.attachEventListeners();
        }
      } catch (error) {
        console.error('检查网站状态失败:', error);
        // 如果检查失败，为了安全起见，不启用预加载
        this.isEnabled = false;
      }
    } else {
      console.log('预加载功能已全局禁用');
    }

    // 监听来自popup的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'togglePreload') {
        this.isEnabled = request.enabled;
        if (this.isEnabled) {
          this.attachEventListeners();
        } else {
          this.removeEventListeners();
          this.clearAllPreloads();
        }
      } else if (request.action === 'settingsUpdated') {
        // 更新设置
        this.isEnabled = request.settings.preloadEnabled !== false;
        this.hoverDelay = request.settings.hoverDelay || 100;
        this.maxPreloads = request.settings.maxPreloads || 5;
        this.preloadMode = request.settings.preloadMode || 'hidden-tab';
        this.networkAware = request.settings.networkAware !== false;
        this.showIndicator = request.settings.showIndicator !== false;
        
        if (this.showIndicator && !this.indicatorStyle) {
          this.injectIndicatorStyles();
        }
        console.log('预加载设置已更新:', request.settings);
      } else if (request.action === 'tabClosed') {
        // 标签页被关闭时，从已激活列表中移除
        if (request.tabId && this.activatedTabs.has(request.tabId)) {
          this.activatedTabs.delete(request.tabId);
          console.log(`标签页已关闭，从已激活列表中移除: ${request.tabId}`);
        }
      } else if (request.action === 'siteRuleChanged') {
        console.log(`网站规则已更改: ${request.domain} - ${request.enabled ? '启用' : '禁用'}`);
        if (!request.enabled) {
          // 禁用预加载：清理所有预加载并移除事件监听器
          this.clearAllPreloads();
          this.removeEventListeners();
          console.log('预加载已禁用，事件监听器已移除');
        } else {
          // 启用预加载：添加事件监听器
          this.attachEventListeners();
          console.log('预加载已启用，事件监听器已添加');
        }
      }
    });
  }

  injectIndicatorStyles() {
    if (this.indicatorStyle) return;
    
    this.indicatorStyle = document.createElement('style');
    this.indicatorStyle.textContent = `
      .preload-indicator {
        position: relative;
      }
      .preload-indicator::after {
        content: '';
        position: absolute;
        top: -2px;
        right: -8px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #4CAF50;
        opacity: 0.8;
        animation: preload-pulse 1.5s infinite;
        pointer-events: none;
      }
      .preload-indicator.loading::after {
        background: #FF9800;
      }
      @keyframes preload-pulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.2); opacity: 1; }
      }
    `;
    document.head.appendChild(this.indicatorStyle);
  }

  attachEventListeners() {
    // 为所有链接添加事件监听器
    document.addEventListener('mouseover', this.boundHandleMouseOver);
    document.addEventListener('mouseout', this.boundHandleMouseOut);
    document.addEventListener('click', this.boundHandleClick);
    document.addEventListener('mousemove', this.boundHandleMouseMove);

    // 定期更新附近链接
    if (!this.updateTimer) {
      this.updateTimer = setInterval(() => {
        this.updateNearbyLinks();
      }, 500);
    }
  }

  removeEventListeners() {
    document.removeEventListener('mouseover', this.boundHandleMouseOver);
    document.removeEventListener('mouseout', this.boundHandleMouseOut);
    document.removeEventListener('click', this.boundHandleClick);
    document.removeEventListener('mousemove', this.boundHandleMouseMove);

    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }

  handleMouseMove(event) {
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }

  handleMouseOver(event) {
    const link = event.target.closest('a[href]');
    if (!link || !this.isValidLink(link.href)) return;

    // 如果已经预加载过，直接返回
    if (this.preloadedLinks.has(link.href) || this.preloadingUrls.has(link.href)) {
      return;
    }

    // 清除之前的定时器
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
    }

    // 设置延迟预加载
    this.hoverTimer = setTimeout(() => {
      // 再次检查是否已经预加载，防止重复
      if (!this.preloadedLinks.has(link.href) && !this.preloadingUrls.has(link.href)) {
        this.preloadLink(link.href, link);
      }
    }, this.hoverDelay);
  }

  handleMouseOut(event) {
    // 清除悬停定时器
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  handleClick(event) {
    const link = event.target.closest('a[href]');
    if (!link || !this.isValidLink(link.href)) return;

    // 如果链接已经预加载，使用预加载的内容
    if (this.preloadedLinks.has(link.href)) {
      event.preventDefault();
      this.openPreloadedLink(link.href);
    }
  }

  isValidLink(href) {
    try {
      const url = new URL(href, window.location.href);
      // 只预加载HTTP/HTTPS链接，排除当前页面和锚点链接
      return (url.protocol === 'http:' || url.protocol === 'https:') &&
             url.href !== window.location.href &&
             !url.href.includes('#');
    } catch {
      return false;
    }
  }

  isVideoSite(href) {
    try {
      const url = new URL(href, window.location.href);
      return this.videoSites.some(site => url.hostname.includes(site));
    } catch {
      return false;
    }
  }

  // 检查网络状态
  shouldPreloadBasedOnNetwork() {
    if (!this.networkAware) return true;
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return true;

    // 在慢速网络下减少预加载
    if (connection.saveData) return false;
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') return false;
    
    return true;
  }

  updateNearbyLinks() {
    // 如果鼠标位置还没有初始化，使用页面中心
    if (this.mousePosition.x === 0 && this.mousePosition.y === 0) {
      this.mousePosition.x = window.innerWidth / 2;
      this.mousePosition.y = window.innerHeight / 2;
    }

    const allLinks = Array.from(document.querySelectorAll('a[href]'))
      .filter(link => this.isValidLink(link.href))
      .map(link => {
        const rect = link.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(centerX - this.mousePosition.x, 2) +
          Math.pow(centerY - this.mousePosition.y, 2)
        );
        return { link, distance, href: link.href };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, this.maxPreloads);

    console.log(`找到 ${allLinks.length} 个附近链接，鼠标位置: (${this.mousePosition.x}, ${this.mousePosition.y})`);

    // 更新附近链接列表
    const newNearbyHrefs = allLinks.map(item => item.href);
    const oldNearbyHrefs = this.nearbyLinks.map(item => item.href);

    // 清理不再需要的预加载
    for (const oldHref of oldNearbyHrefs) {
      if (!newNearbyHrefs.includes(oldHref)) {
        this.removePreload(oldHref);
      }
    }

    this.nearbyLinks = allLinks;

    // 通知popup更新显示
    this.notifyPopupUpdate();
  }

  async preloadLink(href, linkElement = null) {
    // 检查是否已经预加载或正在预加载
    if (this.preloadedLinks.has(href) || this.preloadingUrls.has(href)) {
      console.log(`⏭️ 跳过已预加载或正在预加载的链接: ${href}`);
      return;
    }

    // 检查网络状态
    if (!this.shouldPreloadBasedOnNetwork()) {
      console.log(`⏸️ 网络状态不佳，跳过预加载: ${href}`);
      return;
    }

    // 检查当前网站是否启用预加载（检查当前页面的域名，而不是链接目标）
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'checkSiteEnabled',
        url: window.location.href  // 使用当前页面URL而不是链接URL
      });
      if (response && response.success && response.enabled === false) {
        console.log(`🚫 当前网站已禁用预加载: ${window.location.hostname}`);
        return;
      }
    } catch (error) {
      console.error('检查网站状态失败:', error);
      // 如果检查失败，为了安全起见，不继续预加载
      return;
    }

    // 检查预加载数量限制
    if (this.preloadedLinks.size >= this.maxPreloads) {
      console.log(`🔄 达到预加载上限(${this.maxPreloads})，跳过新的预加载请求`);
      return;
    }

    try {
      console.log(`🎯 开始预加载链接: ${href} (模式: ${this.preloadMode})`);

      // 标记为正在预加载，保存链接元素引用
      this.preloadingUrls.add(href);
      this.preloadedLinks.set(href, { 
        status: 'loading', 
        timestamp: Date.now(),
        linkElement: linkElement  // 保存元素引用
      });

      // 添加加载指示器
      if (this.showIndicator && linkElement) {
        linkElement.classList.add('preload-indicator', 'loading');
      }

      // 根据预加载模式选择方法
      if (this.preloadMode === 'hidden-tab') {
        await this.preloadWithBackgroundTab(href, linkElement);
      } else {
        // 回退到iframe预加载
        this.preloadWithIframe(href, linkElement);
      }

    } catch (error) {
      console.error(`❌ 预加载错误: ${href}`, error);
      this.preloadedLinks.delete(href);
      if (linkElement) {
        linkElement.classList.remove('preload-indicator', 'loading');
      }
    } finally {
      // 无论成功失败都要清理预加载标记
      this.preloadingUrls.delete(href);
    }
  }

  async preloadWithBackgroundTab(href, linkElement = null) {
    try {
      console.log(`📡 向background script发送创建请求: ${href}`);

      // 通过background script创建后台标签页
      const response = await chrome.runtime.sendMessage({
        action: 'createBackgroundTab',
        url: href
      });

      console.log(`📨 收到background script响应:`, response);

      if (response && response.success) {
        this.preloadedLinks.set(href, {
          status: 'loaded',
          timestamp: Date.now(),
          type: 'preload-window',
          tabId: response.tabId,
          linkElement: linkElement  // 保存元素引用
        });
        
        // 更新指示器状态
        if (this.showIndicator && linkElement) {
          linkElement.classList.remove('loading');
        }
        
        console.log(`✅ 预加载完成(预加载窗口): ${href}, TabID: ${response.tabId}`);
      } else {
        throw new Error(response?.error || '创建预加载窗口标签页失败');
      }
    } catch (error) {
      this.preloadedLinks.delete(href);
      if (linkElement) {
        linkElement.classList.remove('preload-indicator', 'loading');
      }
      console.error(`❌ 预加载失败(预加载窗口): ${href}`, error);
      throw error;
    }

    // 设置超时清理
    setTimeout(() => {
      if (this.preloadedLinks.has(href)) {
        console.log(`⏰ 超时清理预加载: ${href}`);
        this.removePreload(href);
      }
    }, 60000); // 后台标签页保持更长时间
  }

  preloadWithIframe(href, linkElement = null) {
    // 创建隐藏的iframe进行预加载
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'display:none;position:absolute;left:-9999px;width:1px;height:1px;';
    iframe.src = href;
    iframe.sandbox = 'allow-scripts allow-same-origin';
    iframe.allow = "autoplay 'none'";

    // 添加加载完成监听器
    iframe.onload = () => {
      this.preloadedLinks.set(href, {
        status: 'loaded',
        timestamp: Date.now(),
        type: 'iframe',
        iframe: iframe,
        linkElement: linkElement  // 保存元素引用
      });
      if (this.showIndicator && linkElement) {
        linkElement.classList.remove('loading');
      }
      console.log(`预加载完成(iframe): ${href}`);
    };

    iframe.onerror = () => {
      this.preloadedLinks.delete(href);
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      if (linkElement) {
        linkElement.classList.remove('preload-indicator', 'loading');
      }
      console.log(`预加载失败(iframe): ${href}`);
    };

    // 添加到页面
    document.body.appendChild(iframe);
    this.preloadFrames.set(href, iframe);

    // 设置超时清理
    setTimeout(() => {
      if (this.preloadedLinks.has(href)) {
        this.removePreload(href);
      }
    }, 30000);
  }

  async openPreloadedLink(href) {
    const preloadData = this.preloadedLinks.get(href);
    if (preloadData && preloadData.status === 'loaded') {
      if (preloadData.type === 'preload-window' && preloadData.tabId) {
        // 激活后台标签页
        try {
          const startTime = Date.now();
          await chrome.runtime.sendMessage({
            action: 'activateTab',
            tabId: preloadData.tabId
          });

          // 计算节省的时间
          const savedTime = Date.now() - startTime;

          // 重要：将此标签页标记为用户已激活，不应被清理
          this.activatedTabs.add(preloadData.tabId);
          console.log(`激活预加载窗口标签页: ${href}, TabID: ${preloadData.tabId}`);
          console.log(`标记标签页为已激活，不会被清理: ${preloadData.tabId}`);

          // 记录命中
          chrome.runtime.sendMessage({
            action: 'recordHit',
            savedTime: savedTime
          }).catch(() => {});

          // 移除指示器（优先使用保存的元素引用）
          if (preloadData.linkElement) {
            try {
              preloadData.linkElement.classList.remove('preload-indicator', 'loading');
            } catch (e) {}
          }
          
          // 从预加载列表中移除，但不关闭标签页
          this.preloadedLinks.delete(href);

        } catch (error) {
          console.error('激活标签页失败:', error);
          // 如果激活失败，回退到普通打开方式
          window.open(href, '_blank');
        }
      } else {
        // 其他类型的预加载，使用普通方式打开
        window.open(href, '_blank');
      }
    }
  }

  async removePreload(href) {
    const preloadData = this.preloadedLinks.get(href);
    if (preloadData) {
      // 优先使用保存的元素引用移除指示器
      if (preloadData.linkElement) {
        try {
          preloadData.linkElement.classList.remove('preload-indicator', 'loading');
        } catch (e) {
          // 元素可能已被移除，忽略错误
        }
      }
      
      if (preloadData.type === 'iframe') {
        const iframe = this.preloadFrames.get(href);
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
        this.preloadFrames.delete(href);
      } else if (preloadData.type === 'prefetch') {
        const link = preloadData.element;
        if (link && link.parentNode) {
          link.parentNode.removeChild(link);
        }
      } else if (preloadData.type === 'preload-window' && preloadData.tabId) {
        // 检查标签页是否已被用户激活
        if (this.activatedTabs.has(preloadData.tabId)) {
          console.log(`跳过关闭用户已激活的标签页: ${href}, TabID: ${preloadData.tabId}`);
          // 不关闭用户已激活的标签页，只从预加载列表中移除
        } else {
          // 关闭未被激活的预加载标签页
          try {
            await chrome.runtime.sendMessage({
              action: 'closeTab',
              tabId: preloadData.tabId
            });
            console.log(`关闭预加载窗口标签页: ${href}, TabID: ${preloadData.tabId}`);
          } catch (error) {
            console.error('关闭标签页失败:', error);
          }
        }
      }
    }
    
    // 备用方案：尝试用选择器查找（处理 href 中的特殊字符）
    try {
      const escapedHref = CSS.escape(href);
      const link = document.querySelector(`a[href="${escapedHref}"]`);
      if (link) {
        link.classList.remove('preload-indicator', 'loading');
      }
    } catch (e) {
      // 选择器失败，忽略
    }
    
    this.preloadedLinks.delete(href);
    this.notifyPopupUpdate();
  }

  async notifyPopupUpdate() {
    // 向background script发送更新消息
    try {
      await chrome.runtime.sendMessage({
        action: 'updatePreloadList',
        preloads: Array.from(this.preloadedLinks.entries()).map(([href, data]) => ({
          href,
          status: data.status,
          timestamp: data.timestamp,
          type: data.type || 'iframe',
          title: this.getLinkTitle(href)
        })),
        nearbyLinks: this.nearbyLinks.map(item => ({
          href: item.href,
          distance: Math.round(item.distance),
          title: this.getLinkTitle(item.href)
        }))
      });
      console.log('预加载信息已更新到background script');
    } catch (error) {
      console.log('发送预加载更新失败:', error);
    }
  }

  getLinkTitle(href) {
    try {
      const link = document.querySelector(`a[href="${href}"]`);
      return link ? (link.textContent.trim().substring(0, 50) || href) : href;
    } catch {
      return href;
    }
  }

  removeOldestPreload() {
    let oldestHref = null;
    let oldestTime = Date.now();

    for (const [href, data] of this.preloadedLinks) {
      if (data.timestamp < oldestTime) {
        oldestTime = data.timestamp;
        oldestHref = href;
      }
    }

    if (oldestHref) {
      this.removePreload(oldestHref);
    }
  }

  clearAllPreloads() {
    for (const href of this.preloadedLinks.keys()) {
      this.removePreload(href);
    }

    // 移除所有指示器
    document.querySelectorAll('.preload-indicator').forEach(el => {
      el.classList.remove('preload-indicator', 'loading');
    });
  }
}

// 页面加载完成后初始化预加载器
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LinkPreloader();
  });
} else {
  new LinkPreloader();
}
