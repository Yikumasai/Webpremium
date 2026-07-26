// 设置页面：表单绑定 + 自动保存（防抖）+ 状态/列表展示

import { COMMAND, DEFAULT_SETTINGS, MESSAGE } from '../shared/constants.js';
import { api, sendToActiveTab } from './api.js';
import { showToast } from './toast.js';
import { clear, el, truncate } from './dom.js';
import { t } from './i18n.js';

const SAVE_DEBOUNCE_MS = 300;
const PRELOAD_POLL_MS = 1500;

const SHORTCUTS = Object.freeze([
  { command: COMMAND.TOGGLE_PRELOAD, labelKey: 'shortcutToggleLabel', expected: 'Alt+P' },
  { command: COMMAND.CLEAR_CACHE, labelKey: 'shortcutClearLabel', expected: 'Alt+C' },
]);

const STATUS_TEXT_KEYS = {
  loading: 'loading',
  loaded: 'loaded',
};
const TYPE_TEXT_KEYS = {
  'preload-window': 'preloadWindow',
  iframe: 'iframe',
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
      smartTabDedup: $('smartTabDedup'),
      searchPageNativeNav: $('searchPageNativeNav'),
      shortcutsEnabled: $('shortcutsEnabled'),
      shortcutStatus: $('shortcutStatus'),
      checkShortcutConflicts: $('checkShortcutConflicts'),
      openShortcutSettings: $('openShortcutSettings'),
      tabOutEnabled: $('tabOutEnabled'),
      advancedFeaturesToggle: $('advancedFeaturesToggle'),
      shortcutFooterText: $('shortcutFooterText'),
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
      showToast(t('loadSettingsFailed'), 'error');
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
    this.els.smartTabDedup.checked = s.smartTabDedup !== false;
    this.els.searchPageNativeNav.checked = s.searchPageNativeNav !== false;
    this.els.shortcutsEnabled.checked = s.shortcutsEnabled === true;
    this.els.tabOutEnabled.checked = s.tabOutEnabled === true;
    this._renderStatus();
    this._renderShortcutStatus({ state: 'idle' });
    this._checkShortcutConflicts({ silent: true });
  }

  _renderStatus() {
    const enabled = this.els.enablePreload.checked;
    this.els.currentStatus.textContent = enabled ? t('statusEnabled') : t('statusDisabled');
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
    this.els.smartTabDedup.addEventListener('change', () => this._scheduleSave());
    this.els.searchPageNativeNav.addEventListener('change', () => this._scheduleSave());
    this.els.shortcutsEnabled.addEventListener('change', () => {
      this._renderShortcutStatus({ state: 'idle' });
      this._checkShortcutConflicts({ silent: false });
      this._scheduleSave();
    });
    this.els.checkShortcutConflicts.addEventListener('click', () =>
      this._checkShortcutConflicts({ silent: false }),
    );
    this.els.openShortcutSettings.addEventListener('click', () => {
      chrome.tabs.create({ url: 'chrome://extensions/shortcuts' }).catch(() => {});
    });
    this.els.tabOutEnabled.addEventListener('change', () => this._scheduleSave());

    this.els.clearCache.addEventListener('click', () => this._clearCache());
    this.els.saveSettings.addEventListener('click', () => this._saveImmediately());
  }

  _scheduleSave() {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    const btn = this.els.saveSettings;
    const original = btn.textContent;
    btn.textContent = t('saving');
    btn.disabled = true;

    this.saveTimer = setTimeout(async () => {
      this.saveTimer = null;
      await this._save({ silent: true });
      btn.textContent = t('autoSaved');
      btn.disabled = false;
      showToast(t('settingsAutoSaved'), 'success');
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
      smartTabDedup: this.els.smartTabDedup.checked,
      searchPageNativeNav: this.els.searchPageNativeNav.checked,
      shortcutsEnabled: this.els.shortcutsEnabled.checked,
      tabOutEnabled: this.els.tabOutEnabled.checked,
      darkMode: this.settings.darkMode,
    };
    try {
      const res = await api.updateSettings(next);
      if (!res?.success) throw new Error(res?.error || t('saveFailed'));
      this.settings = { ...this.settings, ...next };
      if (!silent) showToast(t('settingsSaved'), 'success');
    } catch (err) {
      showToast(t('saveSettingsFailed'), 'error');
    }
  }

  async _clearCache() {
    try {
      const res = await api.clearPreloads();
      if (!res?.success) throw new Error(res?.error);
      this.els.preloadCount.textContent = '0';
      this.lastPreloadCount = 0;
      showToast(t('cacheCleared'), 'success');
    } catch {
      showToast(t('clearCacheFailed'), 'error');
    }
  }

  async _checkShortcutConflicts({ silent }) {
    if (!this.els.shortcutsEnabled.checked) {
      this._renderShortcutStatus({ state: 'disabled' });
      return;
    }

    try {
      const commands = await chrome.commands.getAll();
      const byName = new Map(commands.map((item) => [item.name, item]));
      const missing = [];
      const customized = [];

      for (const shortcut of SHORTCUTS) {
        const actual = byName.get(shortcut.command)?.shortcut || '';
        if (!actual) {
          missing.push(t(shortcut.labelKey));
        } else if (actual !== shortcut.expected) {
          customized.push(t('shortcutCustomizedItem', { label: t(shortcut.labelKey), actual }));
        }
      }

      if (missing.length > 0) {
        this._renderShortcutStatus({ state: 'conflict', missing, customized });
        if (!silent) {
          showToast(t('shortcutUnassignedToast'), 'warning');
        }
        return;
      }

      if (customized.length > 0) {
        this._renderShortcutStatus({ state: 'customized', customized });
        if (!silent) showToast(t('shortcutCustomizedToast'), 'info');
        return;
      }

      this._renderShortcutStatus({ state: 'ok' });
      if (!silent) showToast(t('shortcutOkToast'), 'success');
    } catch {
      this._renderShortcutStatus({ state: 'unknown' });
      if (!silent) showToast(t('shortcutCheckFailed'), 'error');
    }
  }

  _renderShortcutStatus({ state, missing = [], customized = [] }) {
    const enabled = this.els.shortcutsEnabled?.checked === true;
    const status = this.els.shortcutStatus;
    const footer = this.els.shortcutFooterText;
    if (!status) return;

    const setStatus = (className, text) => {
      status.className = `shortcut-status ${className}`;
      status.textContent = text;
    };

    if (!enabled || state === 'disabled') {
      setStatus('disabled', t('shortcutsDisabledDetail'));
      if (footer) footer.textContent = t('shortcutFooterDisabled');
      return;
    }

    if (state === 'conflict') {
      setStatus(
        'warning',
        t('shortcutConflictStatus', { missing: missing.join('、') }),
      );
      if (footer) footer.textContent = t('shortcutFooterConflict');
      return;
    }

    if (state === 'customized') {
      setStatus('info', t('shortcutCustomizedStatus', { customized: customized.join('；') }));
      if (footer) footer.textContent = t('shortcutFooterCustomized', { customized: customized.join(' | ') });
      return;
    }

    if (state === 'unknown') {
      setStatus('warning', t('shortcutUnknownStatus'));
      if (footer) footer.textContent = t('shortcutFooterUnknown');
      return;
    }

    setStatus('ok', t('shortcutOkStatus'));
    if (footer) footer.textContent = t('shortcutFooterOk');
  }

  renderLocalizedText() {
    this._renderStatus();
    this._renderShortcutStatus({ state: 'idle' });
    this._renderPreloadList([]);
    this._renderNearbyList([]);
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
      list.appendChild(el('div', { class: 'empty-message' }, t('noPreloads')));
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
        t(STATUS_TEXT_KEYS[item.status]) || item.status || '',
      ),
      el('span', { class: 'item-type' }, t(TYPE_TEXT_KEYS[item.type]) || item.type || ''),
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
      list.appendChild(el('div', { class: 'empty-message' }, t('noNearbyLinks')));
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
