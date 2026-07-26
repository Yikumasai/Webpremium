<div align="center">
  
# ![](../../icons/icon48.png) Webpremium - Link Preloader

</div>

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
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
- 🔄 **Smart Tab Management** - Automatically detects and jumps to already opened tabs
- 📊 **Real-time Statistics** - Tracks preload effects and time saved
- 🎨 **Modern Interface** - Dark mode support, clean and beautiful interface
- ⚙️ **Highly Customizable** - Rich configuration options to meet personalized needs

---

## 🎯 Features

### Core Functions

#### 1. Smart Preloading
- **Hover Trigger** - Automatic preloading when hovering over links
- **Adjustable Delay Time** - Supports hover delay configuration from 0-1000ms
- **Nearby Link Prediction** - Intelligently identifies links near the cursor and preloads them
- **Preload Quantity Control** - Can set maximum simultaneous preload count (1-10)

#### 2. Preload Modes
- **Preload Window Mode (Recommended)** - Preload in independent minimized window, complete page loading, no interference with main window
- **iframe Preload Mode** - Lightweight preload method, good compatibility

#### 3. Smart Tab Management
- **Duplicate Tab Detection** - Automatically detects tabs with the same URL
- **Auto Jump** - When clicking on already opened links, automatically jumps to existing tab
- **Seamless Movement** - Preloaded tabs move seamlessly to main window
- **Memory Optimization** - Reduces duplicate tabs, decreases memory usage

#### 4. Network Awareness
- **Smart Detection** - Automatically detects network status
- **Adaptive Strategy** - Automatically reduces preloading on slow networks
- **Data Saving** - Avoids wasting data in weak network environments

#### 5. Visual Indicator
- **Preload Status Display** - Shows small dot next to link indicating preload status
- **Loading Animation** - Orange dot indicates loading in progress
- **Load Complete Mark** - Green dot indicates preload complete

#### 6. Site Rules Management
- **Custom Rules** - Enable or disable preloading for specific sites
- **Domain-level Control** - Precise preload control by domain
- **Context Menu** - Quickly toggle preload status of current site

#### 7. Statistics and Analysis
- **Preload Count** - Records total preload count
- **Hit Rate Statistics** - Calculates effective utilization rate of preloading
- **Time Saved** - Statistics of total time saved
- **Session Duration** - Displays usage duration of current session

### Keyboard Shortcuts

- `Alt + P` - Quickly toggle preload function on/off
- `Alt + C` - Clear all preload cache

### Context Menu

- **Preload this link** - Manually preload selected link
- **Enable/Disable preload on this site** - Quickly toggle preload status of current site

---

## 📦 Installation

### Method 1: Chrome Web Store

Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/link-preloader/ajfjclgcglnjglkjgjcenkjjmipddnhj) page and click "Add to Chrome" to install in one click.

### Method 2: Developer Mode Installation

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

3. **View statistics**
   - Click extension icon
   - Switch to "Statistics" tab
   - View preload effect and time saved

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

---

## 🚀 Version History

### v2.0.0 (Current Version)
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

### Development Environment Setup

```bash
# Clone repository
git clone https://github.com/Yikumasai/webpremium.git

# Enter directory
cd webpremium

# Load extension in Chrome
# chrome://extensions/ → Developer mode → Load unpacked
```

### Project Structure

```
webpremium/
├── manifest.json          # Extension configuration file
├── background.js          # Background service script
├── content.js            # Content script
├── popup.html            # Popup window HTML
├── popup.js              # Popup window script
├── popup.css             # Popup window style
├── icons/                # Icon files
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # Documentation
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

<div align="center">

**Faster browsing, better experience**

Made with ❤️ by Webpremium

</div>




