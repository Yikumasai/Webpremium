// 与 background 通信的薄封装

import { MESSAGE } from '../shared/constants.js';

async function send(action, payload = {}) {
  return chrome.runtime.sendMessage({ action, ...payload });
}

export const api = {
  getSettings: () => send(MESSAGE.GET_SETTINGS),
  updateSettings: (settings) => send(MESSAGE.UPDATE_SETTINGS, { settings }),
  getStats: () => send(MESSAGE.GET_STATS),
  resetStats: () => send(MESSAGE.RESET_STATS),
  getSiteRules: () => send(MESSAGE.GET_SITE_RULES),
  updateSiteRule: (domain, rule) => send(MESSAGE.UPDATE_SITE_RULE, { domain, rule }),
  setAllRulesStatus: (enabled) => send(MESSAGE.SET_ALL_RULES_STATUS, { enabled }),
  clearPreloads: () => send(MESSAGE.CLEAR_PRELOADS),
  getCurrentPreloads: (tabId) => send(MESSAGE.GET_CURRENT_PRELOADS, { tabId }),
};

/** 通过 tab.sendMessage 通知当前活动页面 content script。 */
export async function sendToActiveTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  try {
    await chrome.tabs.sendMessage(tab.id, message);
  } catch {
    /* 可能页面没有 content script */
  }
}
