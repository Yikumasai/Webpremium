// URL / 域名工具函数

import { DOWNLOAD_EXTENSIONS } from './constants.js';

export function parseUrl(input, base) {
  try {
    return new URL(input, base);
  } catch {
    return null;
  }
}

export function isHttpUrl(input) {
  const url = parseUrl(input);
  return Boolean(url && (url.protocol === 'http:' || url.protocol === 'https:'));
}

export function getHostname(input) {
  const url = parseUrl(input);
  return url ? url.hostname : '';
}

/**
 * 生成一个域名的所有匹配候选键：完整域名、去 www、加 www、主域名。
 * 用于站点规则查找。
 */
export function domainMatchCandidates(hostname) {
  if (!hostname) return [];
  const candidates = new Set([hostname]);
  if (hostname.startsWith('www.')) {
    candidates.add(hostname.slice(4));
  } else {
    candidates.add(`www.${hostname}`);
  }
  const parts = hostname.split('.');
  if (parts.length > 2) {
    candidates.add(parts.slice(-2).join('.'));
  }
  return [...candidates];
}

export function isDownloadUrl(input, linkElement = null) {
  if (linkElement && linkElement.hasAttribute('download')) return true;
  const url = parseUrl(input);
  if (!url) return false;
  const lastSegment = url.pathname.toLowerCase().split('/').pop() || '';
  const dotIndex = lastSegment.lastIndexOf('.');
  if (dotIndex === -1) return false;
  const ext = lastSegment.slice(dotIndex + 1);
  return DOWNLOAD_EXTENSIONS.has(ext);
}

/**
 * 合法可预加载的 HTTP 链接：排除下载、锚点、同页链接。
 */
export function isPreloadableLink(href, linkElement = null, currentHref = '') {
  const url = parseUrl(href, currentHref || undefined);
  if (!url) return false;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  if (currentHref && url.href === currentHref) return false;
  if (url.hash) return false;
  return !isDownloadUrl(url.href, linkElement);
}
