// 站点规则页

import { api } from './api.js';
import { showToast } from './toast.js';
import { clear, el } from './dom.js';

export class RulesView {
  constructor() {
    const $ = (id) => document.getElementById(id);
    this.els = {
      list: $('rulesList'),
      add: $('addRule'),
      enableAll: $('enableAllRules'),
      disableAll: $('disableAllRules'),
    };
    this.rules = {};
    this.els.add.addEventListener('click', () => this._addRuleDialog());
    this.els.enableAll.addEventListener('click', () => this._setAllEnabled(true));
    this.els.disableAll.addEventListener('click', () => this._setAllEnabled(false));
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
      list.appendChild(el('div', { class: 'empty-message' }, '暂无网站规则'));
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
        enabled ? '已启用' : '已禁用',
      ),
      el('div', { class: 'rule-actions' }, [
        el(
          'button',
          {
            class: 'btn-toggle',
            onClick: () => this._toggle(domain, !enabled),
          },
          enabled ? '禁用' : '启用',
        ),
        el(
          'button',
          {
            class: 'btn-remove',
            onClick: () => this._remove(domain),
          },
          '删除',
        ),
      ]),
    ]);
  }

  async _addRuleDialog() {
    const domain = prompt('请输入要禁用预加载的网站域名（例如: example.com）:');
    if (!domain) return;
    try {
      const res = await api.updateSiteRule(domain.trim(), { enabled: false });
      if (!res?.success) throw new Error(res?.error);
      await this.refresh();
      showToast(`已禁用 ${domain} 的预加载`, 'success');
    } catch {
      showToast('添加规则失败', 'error');
    }
  }

  async _toggle(domain, enabled) {
    try {
      const res = await api.updateSiteRule(domain, { enabled });
      if (!res?.success) throw new Error(res?.error);
      await this.refresh();
      showToast(`${domain} 已${enabled ? '启用' : '禁用'}`, 'success');
    } catch {
      showToast('切换规则状态失败', 'error');
    }
  }

  async _remove(domain) {
    if (!confirm(`确定要删除 ${domain} 的规则吗？`)) return;
    try {
      const res = await api.updateSiteRule(domain, null);
      if (!res?.success) throw new Error(res?.error);
      await this.refresh();
      showToast('规则已删除', 'success');
    } catch {
      showToast('删除规则失败', 'error');
    }
  }

  async _setAllEnabled(enabled) {
    const count = Object.keys(this.rules).length;
    if (count === 0) {
      showToast('没有可操作的规则', 'info');
      return;
    }
    try {
      const res = await api.setAllRulesStatus(enabled);
      if (!res?.success) throw new Error(res?.error);
      await this.refresh();
      showToast(`已${enabled ? '启用' : '禁用'}所有规则 (${count}个)`, 'success');
    } catch {
      showToast('批量操作失败', 'error');
    }
  }
}
