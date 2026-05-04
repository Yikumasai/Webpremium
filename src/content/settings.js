// content script 内的设置读取与变更监听

import { DEFAULT_SETTINGS, SETTINGS_KEYS, MESSAGE } from '../shared/constants.js';

export class ContentSettings extends EventTarget {
  constructor() {
    super();
    this.values = { ...DEFAULT_SETTINGS };
  }

  async load() {
    try {
      const stored = await chrome.storage.sync.get(SETTINGS_KEYS);
      for (const key of SETTINGS_KEYS) {
        if (stored[key] !== undefined) this.values[key] = stored[key];
      }
    } catch {
      // 保留默认值
    }
  }

  /** 监听来自 background 的 settingsUpdated 广播 */
  attachRuntimeListener() {
    chrome.runtime.onMessage.addListener((req) => {
      if (req?.action !== MESSAGE.SETTINGS_UPDATED) return;
      const patch = req.settings || {};
      const changed = {};
      for (const [k, v] of Object.entries(patch)) {
        if (SETTINGS_KEYS.includes(k) && this.values[k] !== v) {
          this.values[k] = v;
          changed[k] = v;
        }
      }
      if (Object.keys(changed).length > 0) {
        this.dispatchEvent(new CustomEvent('change', { detail: changed }));
      }
    });
  }
}
