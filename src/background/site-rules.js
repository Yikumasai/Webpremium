// 网站规则：允许/禁用某个域名的预加载

import { DEFAULT_SITE_RULES, STORAGE_KEYS } from '../shared/constants.js';
import { createLogger } from '../shared/logger.js';
import { domainMatchCandidates, getHostname } from '../shared/url-utils.js';

const log = createLogger('rules');

export class SiteRulesStore {
  constructor() {
    this.rules = new Map();
    this._loaded = this._load();
  }

  async ready() {
    await this._loaded;
    return this;
  }

  async _load() {
    try {
      const { [STORAGE_KEYS.siteRules]: stored } = await chrome.storage.sync.get([
        STORAGE_KEYS.siteRules,
      ]);
      if (stored) this.rules = new Map(Object.entries(stored));
      log.debug('已加载规则数量', this.rules.size);
    } catch (err) {
      log.error('加载网站规则失败', err);
    }
  }

  async _persist() {
    await chrome.storage.sync.set({
      [STORAGE_KEYS.siteRules]: Object.fromEntries(this.rules),
    });
  }

  asObject() {
    return Object.fromEntries(this.rules);
  }

  /** 对给定 URL 判定是否允许预加载。未命中任何规则默认启用。 */
  isEnabledForUrl(url) {
    const hostname = getHostname(url);
    if (!hostname) return true;
    for (const candidate of domainMatchCandidates(hostname)) {
      const rule = this.rules.get(candidate);
      if (rule) return rule.enabled !== false;
    }
    return true;
  }

  async set(domain, rule) {
    if (rule === null) {
      this.rules.delete(domain);
    } else {
      this.rules.set(domain, rule);
    }
    await this._persist();
  }

  async toggleByUrl(url) {
    const hostname = getHostname(url);
    if (!hostname) return null;
    const current = this.rules.get(hostname) || { enabled: true };
    const next = { ...current, enabled: !current.enabled };
    this.rules.set(hostname, next);
    await this._persist();
    return { domain: hostname, enabled: next.enabled };
  }

  async setAll(enabled) {
    if (this.rules.size === 0) return 0;
    for (const rule of this.rules.values()) rule.enabled = enabled;
    await this._persist();
    return this.rules.size;
  }

  /**
   * 为首次安装种子默认规则。不会覆盖用户已有的规则，即使值相同。
   * 返回实际写入的域名列表。
   */
  async ensureDefaults() {
    await this.ready();
    const added = [];
    for (const [domain, rule] of Object.entries(DEFAULT_SITE_RULES)) {
      if (!this.rules.has(domain)) {
        this.rules.set(domain, { ...rule });
        added.push(domain);
      }
    }
    if (added.length > 0) {
      await this._persist();
      log.debug('种子默认规则', added);
    }
    return added;
  }
}
