// 设置存储：chrome.storage.sync + 默认值合并 + 广播

import { DEFAULT_SETTINGS, SETTINGS_KEYS, MESSAGE } from '../shared/constants.js';
import { createLogger } from '../shared/logger.js';

const log = createLogger('settings');

export class SettingsStore {
  async get() {
    try {
      const stored = await chrome.storage.sync.get(SETTINGS_KEYS);
      return { ...DEFAULT_SETTINGS, ...stripUndefined(stored) };
    } catch (err) {
      log.error('读取设置失败', err);
      return { ...DEFAULT_SETTINGS };
    }
  }

  async update(patch) {
    await chrome.storage.sync.set(patch);
    log.debug('设置已更新', patch);
  }

  async ensureDefaults() {
    const current = await chrome.storage.sync.get(SETTINGS_KEYS);
    const missing = {};
    for (const key of SETTINGS_KEYS) {
      if (current[key] === undefined) missing[key] = DEFAULT_SETTINGS[key];
    }
    if (Object.keys(missing).length > 0) {
      await chrome.storage.sync.set(missing);
    }
  }

  async broadcast(patch) {
    const tabs = await chrome.tabs.query({}).catch(() => []);
    await Promise.all(
      tabs
        .filter((t) => t.url && /^https?:/.test(t.url))
        .map((t) =>
          chrome.tabs
            .sendMessage(t.id, { action: MESSAGE.SETTINGS_UPDATED, settings: patch })
            .catch(() => {}),
        ),
    );
  }
}

function stripUndefined(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}
