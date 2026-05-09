# Webpremium 代码审查与清理计划

## 总览

这个项目整体架构清晰，模块拆分合理，代码质量不差。但经过深入分析后，发现以下可精简改进的地方，按优先级排列。

---

## 🔴 P0 — 死代码删除

| # | 位置 | 问题 | 操作 |
|---|------|------|------|
| 1 | `app.js` ~L1115 | `ICONS.archive` SVG 定义从未使用 | 删除 |
| 2 | `app.js` ~L300-317 | `closeTabsExact()` 完整实现从未被调用 | 删除 |
| 3 | `style.css` ~L336 | `.mission-card.collapsed { display: none !important; }` 从未被 JS 添加 class | 删除 |
| 4 | `style.css` ~L204 + `index.html` ~L32 | `.tab-cleanup-icon { display: none; }` 和对应元素永远隐藏 | 删除 CSS + HTML |
| 5 | `style.css` ~L557-565 | `.mission-time` 样式无对应元素 | 删除 |
| 6 | `src/popup/settings-view.js` L24-30 | `TYPE_TEXT_KEYS` 中 `'background-tab'` 和 `'prefetch'` 从未使用 | 删除 |
| 7 | `src/popup/settings-view.js` L19 | `STATUS_TEXT_KEYS` 中 `'failed'` 状态从未被设置 | 删除 |

**预计精简**: ~50 行 JS + ~20 行 CSS + 1 个 HTML 元素

---

## 🟠 P1 — 重复代码

### P1.1 品牌域名提取逻辑重复 2 处

- `src/background/tab-out.js` L114-124: `brandFromUrl()`
- `app.js` L867-877: `friendlyDomain()` 内嵌品牌提取

**方案**: 在 `src/shared/url-utils.js` 新增 `brandFromHostname(hostname)`，两处调用。

### P1.2 浏览器内部 URL 前缀过滤重复

- `src/background/tab-out.js` L10-17: `INTERNAL_URL_PREFIXES`（含 `vivaldi://`, `opera://`）
- `app.js` ~L1142-1152: `getRealTabs()` 硬编码（缺 `vivaldi://`, `opera://`）

**方案**: 将完整列表移到 `src/shared/constants.js` 导出。

### P1.3 Page-chip HTML 模板在 app.js 内部重复

- `buildOverflowChips()` 和 `renderDomainCard()` 中约 45 行相同模板

**方案**: 抽取 `renderPageChip(tab, options)` 函数。

### P1.4 收藏添加逻辑重复

- `src/background/tab-out.js` L63-82 和 `app.js` L440-468

**方案**: 提取 `findFirstEmptySlot()` 和 `buildFavorite()` 纯函数。

---

## 🟡 P2 — 不一致模式

### P2.1 两套 i18n 系统

- `app.js` 用 `local` + `'lang'`，`popup/i18n.js` 用 `sync` + `'uiLanguage'`

**方案**: 统一用 `sync` 的 `'uiLanguage'`，移到 `src/shared/i18n.js`。

### P2.2 两套主题系统

- `app.js` 用 `data-theme` + `local`，`popup/theme.js` 用 `body.dark-mode` + `sync`

**方案**: 统一 `data-theme` + `sync`，移到 `src/shared/theme.js`。

### P2.3 存储 Key 散落各处

**方案**: 全收归 `STORAGE_KEYS`。

---

## 🟢 P3 — 过长函数

| # | 函数 | 文件 | 行数 | 建议 |
|---|------|------|------|------|
| 1 | 全局 click handler | `app.js` | ~335 | `handlerMap[dataAction]` 分发模式 |
| 2 | `renderStaticDashboard()` | `app.js` | ~195 | 拆为 fetch + render |
| 3 | `renderDomainCard()` | `app.js` | ~95 | 见 P1.3 |
| 4 | `run()` | `src/content/main.js` | ~266 | 事件 handler 拆出 |

---

## 🔵 P4 — 简化建议

### P4.1 右键菜单逻辑与 router 重复

`background.js` contextMenus.onClicked 与 `router.js` CREATE_BACKGROUND_TAB 重复。

### P4.2 魔法数字

`preload-window.js` 硬编码 `120`,`140`,`120`,`120` → 命名常量。

### P4.3 onClick 冗余嵌套 in content/main.js

改为 guard 模式。

### P4.4 空 `.catch(() => {})`

至少加 `log.debug()`。

---

## 实施顺序

1. P0 — 直接删
2. P1.1 → P1.2 → P1.3 → P1.4
3. P2.3
4. P3.1
5. P4.1 → P4.2 → P4.3 → P4.4
6. P2.1 + P2.2（最后，因为跨文件改动最大）

## 验证

- 加载扩展无报错
- hover/右键预加载、点击跳转、智能去重正常
- popup 设置正常
- tab-out dashboard 正常
- 中英文、主题切换正常
