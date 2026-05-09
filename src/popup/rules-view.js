// 站点规则页

import { api } from './api.js';
import { showToast } from './toast.js';
import { clear, el } from './dom.js';
import { t } from './i18n.js';

export class RulesView {
  constructor() {
    const $ = (id) => document.getElementById(id);
    this.els = {
      list: $('rulesList'),
      add: $('addRule'),
      enableAll: $('enableAllRules'),
      disableAll: $('disableAllRules'),
      deleteAll: $('deleteAllRules'),
    };
    this.rules = {};
    this.els.add.addEventListener('click', () => this._addRuleDialog());
    this.els.enableAll.addEventListener('click', () => this._setAllEnabled(true));
    this.els.disableAll.addEventListener('click', () => this._setAllEnabled(false));
    this.els.deleteAll.addEventListener('click', () => this._deleteAll());
  }

  async refresh() {
    try {
      const res = await api.getSiteRules();
      this.rules = res?.success ? res.rules || {} : {};
      this._render();
    } catch {
      /* ignore */
    }
  }

  _render() {
    const list = this.els.list;
    clear(list);
    const domains = Object.keys(this.rules);
    if (domains.length === 0) {
      list.appendChild(el('div', { class: 'empty-message' }, t('noSiteRules')));
      return;
    }
    for (const domain of domains) {
      list.appendChild(this._buildRuleItem(domain, this.rules[domain]));
    }
  }

  _buildRuleItem(domain, rule) {
    const enabled = rule?.enabled !== false;
    return el('div', { class: 'rule-item' }, [
      el('div', { class: 'rule-domain' }, domain),
      el(
        'div',
        { class: `rule-status ${enabled ? 'enabled' : 'disabled'}` },
        enabled ? t('enabled') : t('disabled'),
      ),
      el('div', { class: 'rule-actions' }, [
        el(
          'button',
          {
            class: 'btn-toggle',
            onClick: () => this._toggle(domain, !enabled),
          },
          enabled ? t('disable') : t('enable'),
        ),
        el(
          'button',
          {
            class: 'btn-remove',
            onClick: () => this._remove(domain),
          },
          t('delete'),
        ),
      ]),
    ]);
  }

  async _addRuleDialog() {
    const input = prompt(t('enterRulePrompt'));
    if (!input) return;

    const domains = parseDomains(input);
    if (domains.length === 0) {
      showToast(t('invalidDomain'), 'warning');
      return;
    }

    try {
      const results = await Promise.all(
        domains.map((domain) => api.updateSiteRule(domain, { enabled: false })),
      );
      if (results.some((res) => !res?.success)) throw new Error(t('partialRuleAddFailed'));
      await this.refresh();
      showToast(t('rulesAdded', { count: domains.length }), 'success');
    } catch {
      showToast(t('addRuleFailed'), 'error');
    }
  }

  async _toggle(domain, enabled) {
    try {
      const res = await api.updateSiteRule(domain, { enabled });
      if (!res?.success) throw new Error(res?.error);
      await this.refresh();
      showToast(t(enabled ? 'ruleEnabledToast' : 'ruleDisabledToast', { domain }), 'success');
    } catch {
      showToast(t('toggleRuleFailed'), 'error');
    }
  }

  async _remove(domain) {
    if (!confirm(t('deleteRuleConfirm', { domain }))) return;
    try {
      const res = await api.updateSiteRule(domain, null);
      if (!res?.success) throw new Error(res?.error);
      await this.refresh();
      showToast(t('ruleDeleted'), 'success');
    } catch {
      showToast(t('deleteRuleFailed'), 'error');
    }
  }

  async _setAllEnabled(enabled) {
    const count = Object.keys(this.rules).length;
    if (count === 0) {
      showToast(t('noOperableRules'), 'info');
      return;
    }
    try {
      const res = await api.setAllRulesStatus(enabled);
      if (!res?.success) throw new Error(res?.error);
      await this.refresh();
      showToast(t(enabled ? 'allRulesEnabled' : 'allRulesDisabled', { count }), 'success');
    } catch {
      showToast(t('batchOperationFailed'), 'error');
    }
  }

  async _deleteAll() {
    const domains = Object.keys(this.rules);
    const count = domains.length;
    if (count === 0) {
      showToast(t('noDeletableRules'), 'info');
      return;
    }
    if (!confirm(t('deleteAllConfirm', { count }))) return;
    try {
      const results = await Promise.all(
        domains.map((domain) => api.updateSiteRule(domain, null)),
      );
      if (results.some((res) => !res?.success)) throw new Error(t('partialRuleDeleteFailed'));
      await this.refresh();
      showToast(t('allRulesDeleted', { count }), 'success');
    } catch {
      showToast(t('deleteAllFailed'), 'error');
    }
  }
}

function parseDomains(input) {
  const domains = new Set();
  for (const token of input.split(/[\s,，;；]+/)) {
    const domain = normalizeDomain(token);
    if (domain) domains.add(domain);
  }
  return [...domains];
}

function normalizeDomain(value) {
  const raw = value.trim().replace(/^\*\./, '');
  if (!raw) return '';
  try {
    const url = new URL(raw.includes('://') ? raw : `https://${raw}`);
    return url.hostname.replace(/^www\./, '').replace(/\.$/, '').toLowerCase();
  } catch {
    return '';
  }
}
