// 链接预加载器 - Popup 入口
// 把各 view 装配起来，按 tab 切换驱动刷新

import { setupTabs } from './src/popup/tabs.js';
import { ThemeManager } from './src/popup/theme.js';
import { SettingsView } from './src/popup/settings-view.js';
import { StatsView } from './src/popup/stats-view.js';
import { RulesView } from './src/popup/rules-view.js';

document.addEventListener('DOMContentLoaded', async () => {
  const theme = new ThemeManager();
  const stats = new StatsView();
  const rules = new RulesView();
  const settings = new SettingsView({
    onSettingsLoaded: (s) => theme.setMode(s.darkMode || 'auto'),
  });

  document.getElementById('themeToggle').addEventListener('click', () => {
    theme.cycle();
  });

  await settings.init();

  setupTabs((target) => {
    if (target === 'stats') stats.refresh();
    if (target === 'rules') rules.refresh();
  });
});
