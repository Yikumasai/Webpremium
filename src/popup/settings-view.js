// 设置页面：表单绑定 + 自动保存（防抖）+ 状态/列表展示

import { DEFAULT_SETTINGS, MESSAGE } from '../shared/constants.js';
import { api, sendToActiveTab } from './api.js';
import { showToast } from './toast.js';
import { clear, el, truncate } from './dom.js';

const SAVE_DEBOUNCE_MS = 300;
const PRELOAD_POLL_MS = 1500;

const STATUS_TEXT = {
  loading: '加载中',
  loaded: '已加载',
  failed: '失败',
};
const TYPE_TEXT = {
  'preload-window': '预加载窗口',
  'background-tab': '后台标签页',
  iframe: 'iframe',
  prefetch: 'prefetch',
};

export class SettingsView {
  constructor({ onSettingsLoaded } = {}) {
    this.onSettingsLoaded = onSettingsLoaded;
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveTimer = null;
    this.pollTimer = null;
    this.lastPreloadCount = -1;
    this._initElements();
  }

  _initElements() {
    const $ = (id) => document.getElementById(id);
    this.els = {
      enablePreload: $('enablePreload'),
      hoverDelay: $('hoverDelay'),
      hoverDelayValue: $('hoverDelayValue'),
      maxPreloads: $('maxPreloads'),
      maxPreloadsValue: $('maxPreloadsValue'),
      preloadMode: $('preloadMode'),
      networkAware: $('networkAware'),
      showIndicator: $('showIndicator'),
      mutePreload: $('mutePreload'),
      currentStatus: $('currentStatus'),
      preloadCount: $('preloadCount'),
      preloadList: $('preloadList'),
      nearbyList: $('nearbyList'),
      clearCache: $('clearCache'),
      saveSettings: $('saveSettings'),
    };
  }

  async init() {
    await this._loadSettings();
    this._bindEvents();
    this._startPolling();
  }

  destroy() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (this.saveTimer) clearTimeout(this.saveTimer);
  }

  async _loadSettings() {
    try {
      const res = await api.getSettings();
      if (res?.success) {
        this.settings = { ...DEFAULT_SETTINGS, ...res.settings };
        this._renderSettings();
        this.onSettingsLoaded?.(this.settings);
      }
    } catch (err) {
      showToast('加载设置失败', 'error');
    }
  }

  _renderSettings() {
    const s = this.settings;
    this.els.enablePreload.checked = !!s.preloadEnabled;
    this.els.hoverDelay.value = s.hoverDelay;
    this.els.hoverDelayValue.textContent = s.hoverDelay;
    this.els.maxPreloads.value = s.maxPreloads;
    this.els.maxPreloadsValue.textContent = s.maxPreloads;
    this.els.preloadMode.value = s.preloadMode;
    this.els.networkAware.checked = !!s.networkAware;
    this.els.showIndicator.checked = !!s.showIndicator;
    this.els.mutePreload.checked = s.mutePreload !== false;
    this._renderStatus();
  }

  _renderStatus() {
    const enabled = this.els.enablePreload.checked;
    this.els.currentStatus.textContent = enabled ? '已启用' : '已禁用';
    this.els.currentStatus.className = enabled ? 'status-enabled' : 'status-disabled';
  }

  _bindEvents() {
    this.els.enablePreload.addEventListener('change', () => {
      this._renderStatus();
      sendToActiveTab({
        action: MESSAGE.TOGGLE_PRELOAD,
        enabled: this.els.enablePreload.checked,
      });
      this._scheduleSave();
    });

    this.els.hoverDelay.addEventListener('input', (e) => {
      this.els.hoverDelayValue.textContent = e.target.value;
    });
    this.els.hoverDelay.addEventListener('change', () => this._scheduleSave());

    this.els.maxPreloads.addEventListener('input', (e) => {
      this.els.maxPreloadsValue.textContent = e.target.value;
    });
    this.els.maxPreloads.addEventListener('change', () => this._scheduleSave());

    this.els.preloadMode.addEventListener('change', () => this._scheduleSave());
    this.els.networkAware.addEventListener('change', () => this._scheduleSave());
    this.els.showIndicator.addEventListener('change', () => this._scheduleSave());
    this.els.mutePreload.addEventListener('change', () => this._scheduleSave());

    this.els.clearCache.addEventListener('click', () => this._clearCache());
    this.els.saveSettings.addEventListener('click', () => this._saveImmediately());
  }

  _scheduleSave() {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    const btn = this.els.saveSettings;
    const original = btn.textContent;
    btn.textContent = '保存中...';
    btn.disabled = true;

    this.saveTimer = setTimeout(async () => {
      this.saveTimer = null;
      await this._save({ silent: true });
      btn.textContent = '已自动保存';
      btn.disabled = false;
      showToast('设置已自动保存', 'success');
      setTimeout(() => {
        btn.textContent = original;
      }, 1000);
    }, SAVE_DEBOUNCE_MS);
  }

  async _saveImmediately() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    await this._save({ silent: false });
  }

  async _save({ silent }) {
    const next = {
      preloadEnabled: this.els.enablePreload.checked,
      hoverDelay: parseInt(this.els.hoverDelay.value, 10),
      maxPreloads: parseInt(this.els.maxPreloads.value, 10),
      preloadMode: this.els.preloadMode.value,
      networkAware: this.els.networkAware.checked,
      showIndicator: this.els.showIndicator.checked,
      mutePreload: this.els.mutePreload.checked,
      darkMode: this.settings.darkMode,
    };
    try {
      const res = await api.updateSettings(next);
      if (!res?.success) throw new Error(res?.error || '保存失败');
      this.settings = { ...this.settings, ...next };
      if (!silent) showToast('设置已保存', 'success');
    } catch (err) {
      showToast('保存设置失败', 'error');
    }
  }

  async _clearCache() {
    try {
      const res = await api.clearPreloads();
      if (!res?.success) throw new Error(res?.error);
      this.els.preloadCount.textContent = '0';
      this.lastPreloadCount = 0;
      showToast('缓存已清理', 'success');
    } catch {
      showToast('清理缓存失败', 'error');
    }
  }

  _startPolling() {
    this._poll();
    this.pollTimer = setInterval(() => this._poll(), PRELOAD_POLL_MS);
  }

  async _poll() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return;
      const res = await api.getCurrentPreloads(tab.id);
      if (res?.success && res.data) this._renderPreloadInfo(res.data);
    } catch {
      /* ignore */
    }
  }

  _renderPreloadInfo({ preloads = [], nearbyLinks = [] }) {
    if (preloads.length !== this.lastPreloadCount) {
      this.els.preloadCount.textContent = preloads.length;
      this.lastPreloadCount = preloads.length;
    }
    this._renderPreloadList(preloads);
    this._renderNearbyList(nearbyLinks);
  }

  _renderPreloadList(preloads) {
    const list = this.els.preloadList;
    clear(list);
    if (preloads.length === 0) {
      list.appendChild(el('div', { class: 'empty-message' }, '暂无预加载内容'));
      return;
    }
    for (const item of preloads) {
      list.appendChild(this._buildPreloadItem(item));
    }
  }

  _buildPreloadItem(item) {
    const meta = el('div', { class: 'item-meta' }, [
      el(
        'span',
        { class: `item-status ${item.status || ''}` },
        STATUS_TEXT[item.status] || item.status || '',
      ),
      el('span', { class: 'item-type' }, TYPE_TEXT[item.type] || item.type || ''),
      item.tabId != null
        ? el('span', { class: 'item-tab-id' }, `Tab:${item.tabId}`)
        : null,
    ]);
    return el('div', { class: `preload-item ${item.status || ''}` }, [
      el('div', { class: 'item-title' }, truncate(item.title, 40)),
      el('div', { class: 'item-url' }, truncate(item.href, 50)),
      meta,
    ]);
  }

  _renderNearbyList(links) {
    const list = this.els.nearbyList;
    clear(list);
    if (links.length === 0) {
      list.appendChild(el('div', { class: 'empty-message' }, '暂无附近链接'));
      return;
    }
    for (const link of links) {
      list.appendChild(
        el('div', { class: 'nearby-item' }, [
          el('div', { class: 'item-title' }, truncate(link.title, 40)),
          el('div', { class: 'item-url' }, truncate(link.href, 50)),
          el('div', { class: 'item-meta' }, [
            el('span', { class: 'item-distance' }, `${link.distance}px`),
          ]),
        ]),
      );
    }
  }
}
