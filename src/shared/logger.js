// 带开关的日志工具。生产环境默认只保留 warn / error；打开 DEBUG 可见全部。
// 通过 chrome.storage.local 的 `debug` 字段或 URL ?debug=1 触发 DEBUG。

const NOOP = () => {};

function isDebugEnabled() {
  try {
    // content/popup 可能直接访问 localStorage，service worker 不行
    if (typeof localStorage !== 'undefined' && localStorage.getItem('wp:debug') === '1') {
      return true;
    }
  } catch {
    // ignore
  }
  // service worker 上下文可以通过 globalThis.__WP_DEBUG__ 触发
  return Boolean(globalThis.__WP_DEBUG__);
}

export function createLogger(namespace) {
  const prefix = `[WP:${namespace}]`;
  const debug = isDebugEnabled() ? console.debug.bind(console, prefix) : NOOP;
  const info = isDebugEnabled() ? console.info.bind(console, prefix) : NOOP;
  return {
    debug,
    info,
    warn: console.warn.bind(console, prefix),
    error: console.error.bind(console, prefix),
  };
}
