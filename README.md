# 🚀 Webpremium - 链接预加载器

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MPL--2.0-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)

**零延迟浏览体验 | 智能预加载 | 无缝切换**

[功能特性](#-功能特性) • [安装方法](#-安装方法) • [使用说明](#-使用说明) • [工作原理](#-工作原理) • [常见问题](#-常见问题)

</div>

---
<p align="center">
  <a href="./docs/en-US/README.md"><img alt="README in English" src="https://img.shields.io/badge/English-d9d9d9"></a>
  <a href="./docs/zh-TW/README.md"><img alt="繁體中文文件" src="https://img.shields.io/badge/繁體中文-d9d9d9"></a>
  <a href="./README.md"><img alt="简体中文文件" src="https://img.shields.io/badge/简体中文-d9d9d9"></a>
  <a href="./docs/ja-JP/README.md"><img alt="日本語のREADME" src="https://img.shields.io/badge/日本語-d9d9d9"></a>
  <a href="./docs/es-ES/README.md"><img alt="README en Español" src="https://img.shields.io/badge/Español-d9d9d9"></a>
  <a href="./docs/fr-FR/README.md"><img alt="README en Français" src="https://img.shields.io/badge/Français-d9d9d9"></a>
  <a href="./docs/tlh/README.md"><img alt="README tlhIngan Hol" src="https://img.shields.io/badge/Klingon-d9d9d9"></a>
  <a href="./docs/ko-KR/README.md"><img alt="README in Korean" src="https://img.shields.io/badge/한국어-d9d9d9"></a>
  <a href="./docs/ar-SA/README.md"><img alt="README بالعربية" src="https://img.shields.io/badge/العربية-d9d9d9"></a>
  <a href="./docs/tr-TR/README.md"><img alt="Türkçe README" src="https://img.shields.io/badge/Türkçe-d9d9d9"></a>
  <a href="./docs/vi-VN/README.md"><img alt="README Tiếng Việt" src="https://img.shields.io/badge/Ti%E1%BA%BFng%20Vi%E1%BB%87t-d9d9d9"></a>
  <a href="./docs/de-DE/README.md"><img alt="README in Deutsch" src="https://img.shields.io/badge/German-d9d9d9"></a>
  <a href="./docs/bn-BD/README.md"><img alt="README in বাংলা" src="https://img.shields.io/badge/বাংলা-d9d9d9"></a>
</p>


### 简介

Webpremium 是一款革命性的 Chrome 浏览器插件，通过智能预加载技术实现**零延迟**的网页浏览体验。当你的鼠标悬停在链接上时，插件会在后台预加载窗口中提前打开页面。当你真正点击链接时，预加载的标签页会无缝移动到主窗口，让你感受不到任何等待时间。

### ✨ 核心亮点

- 🎯 **零延迟体验** - 鼠标悬停即预加载，点击即打开
- 🪟 **预加载窗口技术** - 独立窗口预加载，主窗口无干扰
- 🔄 **智能标签页管理** - 自动检测并跳转到已打开的标签页
- 📊 **实时统计** - 追踪预加载效果和节省的时间
- 🎨 **现代化界面** - 支持深色模式，界面简洁美观
- ⚙️ **高度可定制** - 丰富的设置选项，满足个性化需求

---

## 🎯 功能特性

### 核心功能

#### 1. 智能预加载
- **鼠标悬停触发** - 当鼠标悬停在链接上时自动预加载
- **可调延迟时间** - 支持 0-1000ms 的悬停延迟设置
- **附近链接预测** - 智能识别鼠标附近的链接并预加载
- **预加载数量控制** - 可设置最大同时预加载数量（1-10个）

#### 2. 预加载模式
- **预加载窗口模式（推荐）** - 在独立的最小化窗口中预加载，完整加载页面，主窗口无干扰
- **iframe 预加载模式** - 轻量级预加载方式，兼容性好

#### 3. 标签页智能管理
- **重复标签页检测** - 自动检测相同 URL 的标签页
- **自动跳转** - 点击已打开的链接时，自动跳转到现有标签页
- **无缝移动** - 预加载标签页无缝移动到主窗口
- **内存优化** - 减少重复标签页，降低内存占用

#### 4. 网络感知
- **智能检测** - 自动检测网络状态
- **自适应策略** - 慢速网络时自动减少预加载
- **流量节省** - 避免在弱网环境下浪费流量

#### 5. 视觉指示器
- **预加载状态显示** - 链接旁显示小圆点指示预加载状态
- **加载中动画** - 橙色圆点表示正在加载
- **已加载标识** - 绿色圆点表示预加载完成

#### 6. 网站规则管理
- **自定义规则** - 为特定网站启用或禁用预加载
- **域名级控制** - 精确到域名的预加载控制
- **右键菜单** - 快速切换当前网站的预加载状态

#### 7. 统计与分析
- **预加载次数** - 记录总预加载次数
- **命中率统计** - 计算预加载的有效利用率
- **时间节省** - 统计为你节省的总时间
- **会话时长** - 显示当前会话的使用时长

### 快捷键

- `Alt + P` - 快速开关预加载功能
- `Alt + C` - 清理所有预加载缓存

### 右键菜单

- **预加载此链接** - 手动预加载选中的链接
- **在此网站启用/禁用预加载** - 快速切换当前网站的预加载状态

---

## 📦 安装方法

### 方法一：开发者模式安装

1. **下载源代码**
   在[release](https://github.com/Yikumasai/Webpremium/releases)页面下载
   
   或
   
   ```bash
   git clone https://github.com/Yikumasai/webpremium.git
   ```

3. **打开 Chrome 扩展程序页面**
   - 在地址栏输入 `chrome://extensions/`
   - 或点击菜单 → 更多工具 → 扩展程序

4. **启用开发者模式**
   - 打开页面右上角的"开发者模式"开关

5. **加载扩展程序**
   - 点击"加载已解压的扩展程序"
   - 选择下载的 `webpremium` 文件夹

6. **完成安装**
   - 扩展程序图标会出现在浏览器工具栏
   - 点击图标即可打开设置面板


### 方法二：Chrome 网上应用店
> 待上架

---

## 🎮 使用说明

### 基础使用

1. **启用插件**
   - 安装后插件默认启用
   - 点击工具栏图标可查看状态

2. **体验预加载**
   - 将鼠标悬停在任意链接上
   - 等待设定的延迟时间（默认 100ms）
   - 链接旁会出现绿色圆点表示预加载完成
   - 点击链接即可瞬间打开

3. **查看统计**
   - 点击插件图标
   - 切换到"统计"标签页
   - 查看预加载效果和节省的时间

### 高级设置

#### 调整悬停延迟
- 打开设置面板
- 拖动"悬停延迟"滑块
- 建议值：100-300ms

#### 设置预加载数量
- 打开设置面板
- 拖动"最大预加载数"滑块
- 建议值：3-5个

#### 选择预加载模式
- **预加载窗口模式**：完整预加载，体验最佳（推荐）
- **iframe 模式**：轻量级，兼容性好

#### 网站规则管理
1. 切换到"网站规则"标签页
2. 点击"添加规则"按钮
3. 输入域名（如：example.com）
4. 设置启用或禁用状态

---

## ⚙️ 工作原理

### 预加载流程

```
用户悬停链接
    ↓
等待延迟时间
    ↓
检查网络状态
    ↓
检查网站规则
    ↓
创建预加载窗口
    ↓
在预加载窗口中打开标签页
    ↓
最小化预加载窗口
    ↓
用户点击链接
    ↓
将标签页移动到主窗口
    ↓
激活标签页
    ↓
完成！
```

### 技术架构

- **Content Script** - 监听页面链接事件，触发预加载
- **Background Service Worker** - 管理预加载窗口和标签页
- **Popup UI** - 提供设置界面和统计信息
- **Chrome Storage API** - 持久化设置和统计数据

### 预加载窗口技术

插件使用独立的预加载窗口来预加载页面：

1. 创建一个小型的 normal 类型窗口
2. 立即最小化该窗口
3. 在窗口中创建预加载标签页
4. 用户点击时将标签页移动到主窗口
5. 激活标签页并聚焦主窗口

这种方式的优势：
- ✅ 完整预加载页面（包括 JavaScript、CSS、图片等）
- ✅ 主窗口完全不受影响
- ✅ 标签页可以无缝移动
- ✅ 支持所有网站和复杂页面

---

## 🎨 界面预览

### 设置面板
- 简洁的开关控制
- 直观的滑块调节
- 实时预加载列表
- 附近链接显示

### 统计面板
- 总预加载次数
- 命中率百分比
- 节省时间统计
- 会话时长显示

### 网站规则
- 域名列表管理
- 启用/禁用状态
- 快速添加/删除

---

## 🔧 配置选项

| 选项 | 说明 | 默认值 | 推荐值 |
|------|------|--------|--------|
| 启用预加载 | 总开关 | 开启 | 开启 |
| 悬停延迟 | 鼠标悬停多久后触发预加载 | 100ms | 100-300ms |
| 最大预加载数 | 同时预加载的最大数量 | 5 | 3-5 |
| 预加载模式 | 预加载方式 | 预加载窗口 | 预加载窗口 |
| 网络感知 | 根据网络状态调整 | 开启 | 开启 |
| 显示指示器 | 显示预加载状态圆点 | 开启 | 开启 |

---

## ❓ 常见问题

### Q: 预加载会消耗很多流量吗？
A: 插件会智能检测网络状态，在慢速网络下自动减少预加载。你也可以通过调整"最大预加载数"来控制流量消耗。

### Q: 预加载会影响浏览器性能吗？
A: 预加载使用独立窗口，对主窗口性能影响极小。同时插件会自动清理过期的预加载内容。

### Q: 为什么有些网站预加载失败？
A: 某些网站可能有防护机制。你可以在"网站规则"中为这些网站禁用预加载。

### Q: 如何知道链接已经预加载？
A: 启用"显示指示器"后，预加载完成的链接旁会显示绿色圆点。

### Q: 预加载窗口会显示出来吗？
A: 不会。预加载窗口会立即最小化，完全不影响你的浏览体验。

### Q: 可以为特定网站禁用预加载吗？
A: 可以。在"网站规则"标签页中添加域名规则，或右键点击页面选择"在此网站启用/禁用预加载"。

---

## 🚀 版本历史

### v2.0.0 (当前版本)
- ✨ 全新的预加载窗口技术
- ✨ 智能标签页管理
- ✨ 网站规则系统
- ✨ 统计与分析功能
- ✨ 网络感知优化
- ✨ 视觉指示器
- ✨ 深色模式支持
- ✨ 快捷键支持
- ✨ 右键菜单集成

### v1.4.6
- 🔧 标签页重复检测
- 🔧 自动跳转功能

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！



### 项目结构

```
webpremium/
├── manifest.json          # 扩展程序配置文件
├── background.js          # 后台服务脚本
├── content.js            # 内容脚本
├── popup.html            # 弹出窗口 HTML
├── popup.js              # 弹出窗口脚本
├── popup.css             # 弹出窗口样式
├── icons/                # 图标文件
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # 说明文档
```

---

## 📄 许可证

Mozilla Public License Version 2.0

本项目采用 MPL-2.0 许可证。详情请查看 [LICENSE](LICENSE) 文件。

---

## 💬 反馈与支持

- 🐛 [报告 Bug](https://github.com/Yikumasai/webpremium/issues)
- 💡 [功能建议](https://github.com/Yikumasai/webpremium/issues)
- 📧 邮箱：likanglin2001@qq.com

---

## 🌟 致谢

感谢所有使用和支持 Webpremium 的用户！

如果这个项目对你有帮助，请给我们一个 ⭐️ Star！

---
## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Yikumasai/Webpremium&type=date&legend=top-left)](https://www.star-history.com/#Yikumasai/Webpremium&type=date&legend=top-left)

---
<div align="center">

**让浏览更快，让体验更好**

Made with ❤️ by Webpremium

</div>
