<div align="center">
  
# ![](../../icons/icon48.png) Webpremium - Link Preloader

</div>

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MPL--2.0-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)

**Zero Latency Browsing Experience | Smart Preloading | Seamless Switching**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [How It Works](#️-how-it-works) • [FAQ](#-faq)

</div>

---
<p align="center">
  <a href="../en-US/README.md"><img alt="README in English" src="https://img.shields.io/badge/English-d9d9d9"></a>
  <a href="../zh-TW/README.md"><img alt="繁體中文文件" src="https://img.shields.io/badge/繁體中文-d9d9d9"></a>
  <a href="../../README.md"><img alt="简体中文文件" src="https://img.shields.io/badge/简体中文-d9d9d9"></a>
  <a href="../ja-JP/README.md"><img alt="日本語のREADME" src="https://img.shields.io/badge/日本語-d9d9d9"></a>
  <a href="../es-ES/README.md"><img alt="README en Español" src="https://img.shields.io/badge/Español-d9d9d9"></a>
  <a href="../fr-FR/README.md"><img alt="README en Français" src="https://img.shields.io/badge/Français-d9d9d9"></a>
  <a href="../ko-KR/README.md"><img alt="README in Korean" src="https://img.shields.io/badge/한국어-d9d9d9"></a>
  <a href="../ar-SA/README.md"><img alt="README بالعربية" src="https://img.shields.io/badge/العربية-d9d9d9"></a>
  <a href="../tr-TR/README.md"><img alt="Türkçe README" src="https://img.shields.io/badge/Türkçe-d9d9d9"></a>
  <a href="../vi-VN/README.md"><img alt="README Tiếng Việt" src="https://img.shields.io/badge/Ti%E1%BA%BFng%20Vi%E1%BB%87t-d9d9d9"></a>
  <a href="../de-DE/README.md"><img alt="README in Deutsch" src="https://img.shields.io/badge/German-d9d9d9"></a>
  <a href="../bn-BD/README.md"><img alt="README in বাংলা" src="https://img.shields.io/badge/বাংলা-d9d9d9"></a>
</p>

## 📖 Introduction

Webpremium is a revolutionary Chrome extension that achieves a **zero-latency** web browsing experience through intelligent preloading technology. When you hover your mouse over a link, the extension opens the page in advance in a background preload window. When you actually click the link, the preloaded tab seamlessly moves to the main window, making you feel no waiting time.

### ✨ Key Highlights

- 🎯 **Zero Latency Experience** - Preload on hover, instant open on click
- 🪟 **Preload Window Technology** - Independent window preloading, no interference with main window
- 🔄 **Smart Tab Dedup** - Automatically detects duplicate tabs and jumps to existing ones on click
- 🏠 **Tab-out New Tab Page** - Beautiful new tab management panel with bookmarks and tab organization
- 📊 **Real-time Statistics** - Tracks preload effects and time saved
- 🎨 **Modern Interface** - Dark mode support, clean and beautiful interface
- ⚙️ **Highly Customizable** - Rich configuration options to meet personalized needs
- 🌐 **Multi-language Support** - Supports Simplified Chinese, Traditional Chinese, English and more

---

## 🎯 Features

### Core Functions

#### 1. Smart Preloading
- **Hover Trigger** - Automatic preloading when hovering over links
- **Adjustable Delay Time** - Supports hover delay configuration from 0-1000ms
- **Nearby Link Prediction** - Intelligently identifies links near the cursor and preloads them
- **Preload Quantity Control** - Can set maximum simultaneous preload count (1-10)
- **LRU Cache Eviction** - Automatically evicts least recently used preloads when limit exceeded

#### 2. Preload Modes
- **Preload Window Mode (Recommended)** - Preload in independent minimized window, complete page loading, no interference with main window
- **iframe Preload Mode** - Lightweight preload method, good compatibility

#### 3. Smart Tab Dedup & Jump
- **Duplicate Tab Detection** - Detects whether the target page is already open in the current window before preloading
- **Auto Jump** - Automatically jumps to existing tab when clicking already opened links, avoids duplicate tabs
- **Skip Preload** - Skips preloading and jumps directly if the target page is already open
- **Seamless Experience** - Automatically focuses the target tab and window

#### 4. Tab-out New Tab Page Management
- **Beautiful New Tab Page** - Replaces default new tab page with a feature-rich management panel
- **Three-column Layout** - Bookmarks on left, open tabs in middle, read-later on right
- **Domain Grouping** - Automatically groups open tabs by domain
- **Bookmarks** - Long-term bookmarks for frequently used sites with custom icons
- **Tab Count Badge** - Toolbar icon shows current open tab count
- **Duplicate Tab Detection** - Automatically detects and prompts to close duplicate new tab pages
- **Quick Actions** - One-click close, pin, add to bookmarks, etc.
- **Dark Mode** - Light/dark theme switching support
- **Multi-language** - Chinese/English interface switching

#### 5. Network Awareness
- **Smart Detection** - Automatically detects network status
- **Adaptive Strategy** - Automatically reduces preloading on slow networks
- **Data Saving** - Avoids wasting data in weak network environments

#### 6. Preload Mute
- **Muted by Default** - Preloaded tabs are muted by default to avoid auto-playing sound from videos/livestreams
- **Manual Unmute** - Click the address bar after activating to unmute

#### 7. Visual Indicator
- **Preload Status Display** - Shows small dot next to link indicating preload status
- **Loading Animation** - Orange dot indicates loading in progress
- **Load Complete Mark** - Green dot indicates preload complete

#### 8. Site Rules Management
- **Custom Rules** - Enable or disable preloading for specific sites
- **Domain-level Control** - Precise preload control by domain
- **Context Menu** - Quickly toggle preload status of current site
- **Default Rules** - Preload disabled by default for video sites such as Douyin

#### 9. Statistics and Analysis
- **Preload Count** - Records total preload count
- **Hit Rate Statistics** - Calculates effective utilization rate of preloading
- **Time Saved** - Statistics of total time saved
- **Session Duration** - Displays usage duration of current session

### Keyboard Shortcuts

- `Alt + P` - Quickly toggle preload function on/off (must be enabled in settings)
- `Alt + C` - Clear all preload cache (must be enabled in settings)
- Shortcuts are disabled by default to avoid conflicts with system or other extensions

### Context Menu

- **Preload this link** - Manually preload selected link
- **Enable/Disable preload on this site** - Quickly toggle preload status of current site
- **Add page to bookmarks** - Add current page to Tab-out bookmarks
- **Add link to bookmarks** - Add link to Tab-out bookmarks

---

## 📦 Installation

### Method 1: Developer Mode Installation

1. **Download source code**
   Download from [releases](https://github.com/Yikumasai/Webpremium/releases) page
   
   or
   
   ```bash
   git clone https://github.com/Yikumasai/webpremium.git
   ```

2. **Open Chrome extensions page**
   - Enter `chrome://extensions/` in the address bar
   - Or click menu → More tools → Extensions

3. **Enable developer mode**
   - Turn on the "Developer mode" switch in the upper right corner

4. **Load extension**
   - Click "Load unpacked"
   - Select the downloaded `webpremium` folder

5. **Complete installation**
   - Extension icon will appear in browser toolbar
   - Click icon to open settings panel

### Method 2: Chrome Web Store
> Coming soon

---

## 🎮 Usage

### Basic Usage

1. **Enable extension**
   - Extension is enabled by default after installation
   - Click toolbar icon to check status

2. **Experience preloading**
   - Hover mouse over any link
   - Wait for configured delay time (default 100ms)
   - Green dot will appear next to link when preload is complete
   - Click link to open instantly

3. **Smart Tab Jump**
   - When the target page is already open in the current window
   - Clicking the link automatically jumps to the existing tab
   - Avoids opening the same page twice

4. **View statistics**
   - Click extension icon
   - Switch to "Statistics" tab
   - View preload effect and time saved

### Tab-out New Tab Page

1. **Enable Tab-out**
   - Open settings panel
   - Toggle "Tab-out New Tab Page" under "Advanced Features"
   - Open a new tab to see the management panel

2. **Use Bookmarks**
   - Click the "+" button in the upper left to add bookmarks
   - Right-click a tab and select "Add to bookmarks"
   - Bookmarks persist for quick access

3. **Manage Tabs**
   - Middle column shows all open tabs (grouped by domain)
   - Click a tab to jump to its page
   - Click "×" to close a single tab or an entire domain group

### Advanced Settings

#### Adjust Hover Delay
- Open settings panel
- Drag "Hover delay" slider
- Recommended value: 100-300ms

#### Set Preload Count
- Open settings panel
- Drag "Maximum preload count" slider
- Recommended value: 3-5

#### Select Preload Mode
- **Preload Window Mode**: Complete preload, best experience (recommended)
- **iframe Mode**: Lightweight, good compatibility

#### Enable Shortcuts
- Open settings panel
- Toggle the "Enable shortcuts" option
- Use `Alt+P` to toggle preload, `Alt+C` to clear cache
- Customize shortcuts in Chrome's keyboard shortcut settings

#### Site Rules Management
1. Switch to "Site rules" tab
2. Click "Add rule" button
3. Enter domain (e.g., example.com)
4. Set enabled or disabled status

---

## ⚙️ How It Works

### Preload Flow

```
User hovers over link
    ↓
Wait for delay time
    ↓
Check network status
    ↓
Check site rules
    ↓
Create preload window
    ↓
Open tab in preload window
    ↓
Minimize preload window
    ↓
User clicks link
    ↓
Move tab to main window
    ↓
Activate tab
    ↓
Complete!
```

### Technical Architecture

- **Content Script** - Listens to page link events, triggers preloading
- **Background Service Worker** - Manages preload window and tabs
- **Popup UI** - Provides settings interface and statistics information
- **Chrome Storage API** - Persists settings and statistics data

### Preload Window Technology

The extension uses an independent preload window to preload pages:

1. Creates a small normal-type window
2. Immediately minimizes that window
3. Creates preload tab in the window
4. Moves tab to main window when user clicks
5. Activates tab and focuses main window

Advantages of this approach:
- ✅ Complete page preload (including JavaScript, CSS, images, etc.)
- ✅ Main window completely unaffected
- ✅ Tabs can be moved seamlessly
- ✅ Supports all websites and complex pages

---

## 🎨 Interface Preview

### Settings Panel
- Simple switch control
- Intuitive slider adjustment
- Real-time preload list
- Nearby links display

### Statistics Panel
- Total preload count
- Hit rate percentage
- Time saved statistics
- Session duration display

### Site Rules
- Domain list management
- Enabled/Disabled status
- Quick add/delete

---

## 🔧 Configuration Options

| Option | Description | Default Value | Recommended Value |
|------|------|--------|--------|
| Enable preload | Main switch | On | On |
| Hover delay | Time after hover to trigger preload | 100ms | 100-300ms |
| Maximum preload count | Maximum amount of simultaneous preloads | 5 | 3-5 |
| Preload mode | Preload method | Preload window | Preload window |
| Network awareness | Adjust according to network status | On | On |
| Show indicator | Show preload status dot | On | On |
| Preload mute | Mute preloaded tabs by default | On | On |
| Smart Tab Dedup | Detect and jump to opened tabs | On | On |
| Tab-out New Tab Page | Enable new tab management panel | Off | As needed |
| Shortcuts | Enable Alt+P / Alt+C | Off | As needed |

---

## ❓ FAQ

### Q: Does preloading consume a lot of data?
A: The extension intelligently detects network status and automatically reduces preloading on slow networks. You can also control data consumption by adjusting the "Maximum preload count".

### Q: Does preloading affect browser performance?
A: Preloading uses an independent window, so the impact on main window performance is minimal. Additionally, the extension automatically cleans up expired preload content.

### Q: Why does preloading fail on some sites?
A: Some sites may have protection mechanisms. You can disable preloading for these sites in "Site rules".

### Q: How do I know if a link has been preloaded?
A: After enabling "Show indicator", a green dot will appear next to preloaded links.

### Q: Will the preload window be displayed?
A: No. The preload window is immediately minimized and does not affect your browsing experience at all.

### Q: Can I disable preloading for specific sites?
A: Yes. Add domain rules in the "Site rules" tab, or right-click on the page and select "Enable/Disable preload on this site".

### Q: What is Smart Tab Dedup?
A: When the link you're about to click is already open in the current window, the extension automatically jumps to the existing tab instead of opening a new one. This avoids duplicate tabs and saves memory.

### Q: What is Tab-out?
A: Tab-out is a beautiful new tab management panel that displays all your open tabs (grouped by domain), bookmarks for frequently used sites, read-later management, and more.

### Q: Will preloaded tabs play sound?
A: No. Preloaded tabs are muted by default to avoid auto-playing sound from videos or livestream sites. After activating, you can click the address bar to unmute.

### Q: Why aren't my shortcuts working?
A: Shortcuts are disabled by default and must be manually enabled in the settings. This avoids conflicts with system or other extension shortcuts.

---

## 🚀 Version History

### v2.1.0 (Current Version)
- ✨ **Smart Tab Dedup & Jump** - Detects whether the target page is already open in the current window before preloading; jumps to existing tab on click
- ✨ **Tab-out New Tab Page Management** - Beautiful new tab panel with domain grouping, bookmarks, and tab count badge
- ✨ **Preload Mute** - Preloaded tabs muted by default to avoid auto-playing sound
- ✨ **Shortcut Conflict Detection** - Automatically detects and warns about shortcut conflicts
- ✨ **Multi-language Support** - Supports Simplified Chinese, Traditional Chinese, and English interfaces
- ✨ **LRU Cache Eviction** - Automatically evicts least recently used content when preload limit exceeded
- ✨ **Default Site Rules** - Preload disabled by default for video sites such as Douyin
- 🔧 Optimized preload window management with multi-window reuse
- 🔧 Optimized tab tracking and cleanup logic

### v2.0.0
- ✨ New preload window technology
- ✨ Smart tab management
- ✨ Site rules system
- ✨ Statistics and analysis functions
- ✨ Network awareness optimization
- ✨ Visual indicator
- ✨ Dark mode support
- ✨ Keyboard shortcut support
- ✨ Context menu integration

### v1.4.6
- 🔧 Duplicate tab detection
- 🔧 Auto jump function

---

## 🤝 Contributing

Issues and Pull Requests are welcome!



### Project Structure

```
webpremium/
├── manifest.json          # Extension configuration file
├── background.js          # Background service script entry
├── content.js             # Content script entry
├── popup.html             # Popup window HTML
├── popup.js               # Popup window script entry
├── popup.css              # Popup window style
├── index.html             # Tab-out new tab page HTML
├── app.js                 # Tab-out new tab page logic
├── style.css              # Tab-out new tab page style
├── icons/                 # Icon files
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── src/                   # Modular source code
│   ├── background/        # Background modules
│   │   ├── preload-window.js   # Preload window management
│   │   ├── router.js           # Message routing
│   │   ├── settings-store.js   # Settings storage
│   │   ├── site-rules.js       # Site rules
│   │   ├── stats.js            # Statistics
│   │   ├── tab-deduper.js      # Tab dedup
│   │   ├── tab-out.js          # Tab-out feature
│   │   └── tab-tracker.js      # Tab tracking
│   ├── content/           # Content script modules
│   │   ├── indicator.js        # Visual indicator
│   │   ├── link-tracker.js     # Link tracking
│   │   ├── main.js             # Main entry
│   │   ├── network-aware.js    # Network awareness
│   │   ├── preloader.js        # Preloader
│   │   └── settings.js         # Settings management
│   ├── popup/             # Popup modules
│   │   ├── api.js              # API wrapper
│   │   ├── dom.js              # DOM utilities
│   │   ├── i18n.js             # Internationalization
│   │   ├── rules-view.js       # Rules view
│   │   ├── settings-view.js    # Settings view
│   │   ├── stats-view.js       # Statistics view
│   │   ├── tabs.js             # Tab switching
│   │   ├── theme.js            # Theme
│   │   └── toast.js            # Toast messages
│   └── shared/            # Shared modules
│       ├── constants.js        # Constants
│       ├── logger.js           # Logging
│       └── url-utils.js        # URL utilities
└── README.md              # Documentation
```

---

## 📄 License

Mozilla Public License Version 2.0

This project adopts the MPL-2.0 license. For details, please see the [LICENSE](../../LICENSE) file.

---

## 💬 Feedback and Support

- 🐛 [Report Bug](https://github.com/Yikumasai/webpremium/issues)
- 💡 [Feature Suggestions](https://github.com/Yikumasai/webpremium/issues)
- 📧 Email: likanglin2001@qq.com

---

## 🌟 Acknowledgments

Thanks to all users who use and support Webpremium!

If this project helps you, please give us a ⭐️ Star!

---
## Star History

<a href="https://www.star-history.com/#Yikumasai/Webpremium&type=timeline&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Yikumasai/Webpremium&type=timeline&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Yikumasai/Webpremium&type=timeline&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Yikumasai/Webpremium&type=timeline&legend=top-left" />
 </picture>
</a>

---
<div align="center">

**Faster browsing, better experience**

Made with ❤️ by Webpremium

</div>




