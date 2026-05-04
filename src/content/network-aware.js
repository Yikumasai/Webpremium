// 根据网络状况判断是否应该继续预加载

export function shouldPreloadOnCurrentNetwork({ networkAware = true } = {}) {
  if (!networkAware) return true;
  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return true;
  if (connection.saveData) return false;
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
    return false;
  }
  return true;
}
