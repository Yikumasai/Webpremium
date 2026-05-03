// 顶部 tab 切换

export function setupTabs(onChange) {
  const buttons = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach((b) => b.classList.toggle('active', b === btn));
      contents.forEach((c) => c.classList.toggle('active', c.id === `${target}-tab`));
      onChange?.(target);
    });
  });
}
