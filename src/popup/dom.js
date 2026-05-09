// DOM 工具：安全文本节点构建（防 XSS）+ 截断

export function truncate(text, maxLength) {
  if (text == null) return '';
  const s = String(text);
  return s.length <= maxLength ? s : `${s.slice(0, maxLength)}...`;
}

/**
 * 用 DOM API 安全构造列表项，避免 innerHTML 拼接 XSS。
 * children 中字符串会被当作文本节点。
 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'dataset') {
      for (const [dk, dv] of Object.entries(value)) node.dataset[dk] = dv;
    } else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      node.setAttribute(key, value);
    }
  }
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}
