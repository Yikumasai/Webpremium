// URL / 域名工具函数

import {
  DOWNLOAD_EXTENSIONS,
  TRACKING_PARAMS,
  TRACKING_PARAM_PREFIXES,
} from './constants.js';

const SECOND_LEVEL_TLDS = ['co.uk', 'co.jp', 'com.cn', 'com.tw', 'com.au', 'com.hk', 'co.kr'];

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
 * 把 URL 归一成"同一个网页"的比较键，用于标签页去重与跳转。
 *
 * 归一规则（每一条都对应一类会导致去重漏判的真实场景）：
 *   - 协议忽略：http / https 视为同一页（站点普遍会重定向到 https）
 *   - 主机小写、去掉 www. 前缀
 *   - 路径去掉末尾斜杠（/a 与 /a/ 是同一页）
 *   - 剔除 utm_/fbclid 等来源标记参数，其余参数排序后比较（参数顺序无意义）
 *   - 锚点 #section 丢弃（同一页面内定位）；但 hash 路由 #/path 保留（确实是不同页面）
 *
 * @returns {string} 比较键；非 http(s) URL 返回空串
 */
export function canonicalizeUrl(input, base) {
  const url = parseUrl(input, base);
  if (!url) return '';
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';

  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const port = url.port ? `:${url.port}` : '';
  const path = url.pathname === '/' ? '' : url.pathname.replace(/\/+$/, '');
  return `${host}${port}${path}${canonicalQuery(url.searchParams)}${canonicalHash(url.hash)}`;
}

function canonicalQuery(searchParams) {
  const pairs = [];
  for (const [key, value] of searchParams) {
    if (isTrackingParam(key)) continue;
    pairs.push([key, value]);
  }
  if (pairs.length === 0) return '';
  pairs.sort((a, b) => (a[0] === b[0] ? compare(a[1], b[1]) : compare(a[0], b[0])));
  return `?${pairs.map(([k, v]) => `${k}=${v}`).join('&')}`;
}

function compare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function isTrackingParam(key) {
  const lower = key.toLowerCase();
  return (
    TRACKING_PARAMS.has(lower) || TRACKING_PARAM_PREFIXES.some((p) => lower.startsWith(p))
  );
}

function canonicalHash(hash) {
  // "#/xxx" 是 hash 路由（不同页面），其余锚点只是页内定位（同一页面）
  return hash.startsWith('#/') ? hash : '';
}

export function isSameCanonicalUrl(a, b) {
  const keyA = canonicalizeUrl(a);
  return Boolean(keyA) && keyA === canonicalizeUrl(b);
}

/**
 * 可参与"标签页去重与跳转"的链接：合法 http(s)、不是下载、不是指向当前页。
 * 与 isPreloadableLink 的区别：允许带锚点的链接（去重按规范化 URL 比较，锚点不影响判定）。
 */
export function isDedupCandidateLink(href, linkElement = null, currentHref = '') {
  const url = parseUrl(href, currentHref || undefined);
  if (!url) return false;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  if (currentHref && isSameCanonicalUrl(url.href, currentHref)) return false;
  return !isDownloadUrl(url.href, linkElement);
}

/**
 * 合法可预加载的 HTTP 链接：排除下载、锚点、同页链接。
 * 锚点链接不预加载（预加载整页收益低），但仍可参与去重 —— 见 isDedupCandidateLink。
 */
export function isPreloadableLink(href, linkElement = null, currentHref = '') {
  const url = parseUrl(href, currentHref || undefined);
  if (!url) return false;
  if (url.hash) return false;
  return isDedupCandidateLink(href, linkElement, currentHref);
}

/**
 * 从 hostname 提取品牌名。例: "www.binance.com" → "Binance", "accounts.binance.co.uk" → "Binance"
 */
export function brandFromHostname(hostname) {
  if (!hostname) return '';
  const parts = hostname.replace(/^www\./, '').split('.');
  let brand;
  if (parts.length >= 3 && SECOND_LEVEL_TLDS.includes(parts.slice(-2).join('.'))) {
    brand = parts[parts.length - 3];
  } else if (parts.length >= 2) {
    brand = parts[parts.length - 2];
  } else {
    brand = parts[0];
  }
  return brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : '';
}
