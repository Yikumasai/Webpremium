// content script 入口：动态加载真正的模块化逻辑
// (content script 无法直接使用静态 import，所以走 dynamic import)

(async () => {
  try {
    const url = chrome.runtime.getURL('src/content/main.js');
    const mod = await import(url);
    await mod.run();
  } catch (err) {
    console.error('[WP:content] bootstrap failed', err);
  }
})();
