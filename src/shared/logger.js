// 带开关的日志工具。生产环境默认只保留 warn / error；打开 DEBUG 可见全部。
//
// 开关必须在每次调用时求值，不能在 createLogger 时就固化：service worker 里没有
// localStorage，而模块是在 SW 启动的第一时间加载的，那时任何开关都还来不及设置 ——
// 固化的结果就是 background 侧的 debug 日志永远不会输出。

const NOOP = () => {};

let debugOverride = null;

/** 供 background 从 chrome.storage.local 读到 debug 开关后写入。 */
export function setDebugEnabled(enabled) {
  debugOverride = Boolean(enabled);
}

function isDebugEnabled() {
  if (debugOverride !== null) return debugOverride;
  try {
    // content/popup 可能直接访问 localStorage，service worker 不行
    if (typeof localStorage !== 'undefined' && localStorage.getItem('wp:debug') === '1') {
      return true;
    }
  } catch {
    // ignore
  }
  return Boolean(globalThis.__WP_DEBUG__);
}

export function createLogger(namespace) {
  const prefix = `[WP:${namespace}]`;
  const lazy = (method) => (...args) => {
    if (!isDebugEnabled()) return;
    console[method](prefix, ...args);
  };
  return {
    debug: lazy('debug'),
    info: lazy('info'),
    warn: console.warn.bind(console, prefix),
    error: console.error.bind(console, prefix),
  };
}

export { NOOP };
