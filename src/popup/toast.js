// 简单的右上角浮动通知

const COLORS = {
  success: '#34a853',
  error: '#ea4335',
  info: '#1a73e8',
};

let stylesInjected = false;

function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
@keyframes wp-toast-slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.wp-toast {
  position: fixed; top: 10px; right: 10px;
  padding: 8px 12px; border-radius: 4px; color: white;
  font-size: 12px; z-index: 1000;
  animation: wp-toast-slide-in 0.3s ease;
}
`;
  document.head.appendChild(style);
}

export function showToast(message, type = 'info', durationMs = 3000) {
  injectStyles();
  const el = document.createElement('div');
  el.className = 'wp-toast';
  el.textContent = message;
  el.style.backgroundColor = COLORS[type] ?? COLORS.info;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), durationMs);
}
