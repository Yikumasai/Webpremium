<div align="center">
  
# ![](../../icons/icon48.png) Webpremium - 連結預載入器

</div>

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MPL--2.0-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)

**零延遲瀏覽體驗 | 智慧預載入 | 無縫切換**

[功能特性](#-功能特性) • [安裝方法](#-安裝方法) • [使用說明](#-使用說明) • [工作原理](#-工作原理) • [常見問題](#-常見問題)

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

## 📖 簡介

Webpremium 是一款革命性的 Chrome 瀏覽器擴充功能，透過智慧預載入技術實現**零延遲**的網頁瀏覽體驗。當您的滑鼠懸停在連結上時，擴充功能會在背景預載入視窗中提前開啟頁面。當您真正點擊連結時，預載入的分頁會無縫移動到主視窗，讓您感受不到任何等待時間。

### ✨ 核心亮點

- 🎯 **零延遲體驗** - 滑鼠懸停即預載入，點擊即開啟
- 🪟 **預載入視窗技術** - 獨立視窗預載入，主視窗無干擾
- 🔄 **智慧分頁去重** - 自動偵測重複分頁，點擊時跳轉到已有分頁
- 🏠 **Tab-out 新分頁** - 美觀的新分頁管理面板，支援收藏和分頁整理
- 📊 **即時統計** - 追蹤預載入效果和節省的時間
- 🎨 **現代化介面** - 支援深色模式，介面簡潔美觀
- ⚙️ **高度可自訂** - 豐富的設定選項，滿足個人化需求
- 🌐 **多語言支援** - 支援簡體中文、繁體中文、英文等多語言介面

---

## 🎯 功能特性

### 核心功能

#### 1. 智慧預載入
- **滑鼠懸停觸發** - 當滑鼠懸停在連結上時自動預載入
- **可調延遲時間** - 支援 0-1000ms 的懸停延遲設定
- **附近連結預測** - 智慧識別滑鼠附近的連結並預載入
- **預載入數量控制** - 可設定最大同時預載入數量（1-10個）
- **LRU 快取淘汰** - 超出上限時自動淘汰最久未使用的預載入

#### 2. 預載入模式
- **預載入視窗模式（推薦）** - 在獨立的最小化視窗中預載入，完整載入頁面，主視窗無干擾
- **iframe 預載入模式** - 輕量級預載入方式，相容性好

#### 3. 智慧分頁去重與跳轉 (Smart Tab Dedup)
- **重複分頁偵測** - 預載入前偵測目前視窗是否已開啟目標網頁
- **自動跳轉** - 點擊已開啟的連結時，自動跳轉到現有分頁，避免重複開啟
- **預載入跳過** - 如果目標頁面已開啟，跳過預載入直接跳轉
- **無縫體驗** - 自動聚焦到目標分頁和視窗

#### 4. Tab-out 新分頁管理
- **美觀的新分頁** - 取代預設新分頁，顯示功能豐富的管理面板
- **三欄佈局** - 左側收藏、中間開啟的分頁、右側稍後閱讀
- **網域分組** - 自動依網域分組顯示開啟的分頁
- **收藏功能** - 長期收藏常用網站，支援自訂圖示
- **分頁數量徽章** - 工具列圖示顯示目前開啟的分頁數量
- **重複分頁偵測** - 自動偵測並提示關閉重複的新分頁
- **快捷操作** - 關閉分頁、釘選分頁、加入收藏等一鍵操作
- **深色模式** - 支援淺色/深色主題切換
- **多語言** - 支援中英文介面切換

#### 5. 網路感知
- **智慧偵測** - 自動偵測網路狀態
- **自適應策略** - 慢速網路時自動減少預載入
- **流量節省** - 避免在弱網環境下浪費流量

#### 6. 預載入靜音
- **預設靜音** - 預載入分頁預設靜音，避免影片/直播自動播放出聲
- **手動解除** - 啟用後可在網址列點擊解除靜音

#### 7. 視覺指示器
- **預載入狀態顯示** - 連結旁顯示小圓點指示預載入狀態
- **載入中動畫** - 橙色圓點表示正在載入
- **已載入標識** - 綠色圓點表示預載入完成

#### 8. 網站規則管理
- **自訂規則** - 為特定網站啟用或停用預載入
- **網域級控制** - 精確到網域的預載入控制
- **右鍵選單** - 快速切換目前網站的預載入狀態
- **預設規則** - 預置抖音等影片網站預設停用預載入

#### 9. 統計與分析
- **預載入次數** - 記錄總預載入次數
- **命中率統計** - 計算預載入的有效利用率
- **時間節省** - 統計為您節省的總時間
- **工作階段時長** - 顯示目前工作階段的使用時長

### 快速鍵

- `Alt + P` - 快速開關預載入功能（需在設定中啟用）
- `Alt + C` - 清理所有預載入快取（需在設定中啟用）
- 快速鍵預設關閉，避免與系統或其他擴充功能衝突

### 右鍵選單

- **預載入此連結** - 手動預載入選取的連結
- **在此網站啟用/停用預載入** - 快速切換目前網站的預載入狀態
- **加入頁面到收藏** - 將目前頁面加入到 Tab-out 收藏
- **加入連結到收藏** - 將連結加入到 Tab-out 收藏

---

## 📦 安裝方法

### 方法一：開發者模式安裝

1. **下載原始碼**
   在 [release](https://github.com/Yikumasai/Webpremium/releases) 頁面下載
   
   或
   
   ```bash
   git clone https://github.com/Yikumasai/webpremium.git
   ```

2. **開啟 Chrome 擴充功能頁面**
   - 在網址列輸入 `chrome://extensions/`
   - 或點擊選單 → 更多工具 → 擴充功能

3. **啟用開發人員模式**
   - 開啟頁面右上角的「開發人員模式」開關

4. **載入擴充功能**
   - 點擊「載入未封裝項目」
   - 選擇下載的 `webpremium` 資料夾

5. **完成安裝**
   - 擴充功能圖示會出現在瀏覽器工具列
   - 點擊圖示即可開啟設定面板

### 方法二：Chrome 線上應用程式商店
> 待上架

---

## 🎮 使用說明

### 基礎使用

1. **啟用擴充功能**
   - 安裝後擴充功能預設啟用
   - 點擊工具列圖示可查看狀態

2. **體驗預載入**
   - 將滑鼠懸停在任意連結上
   - 等待設定的延遲時間（預設 100ms）
   - 連結旁會出現綠色圓點表示預載入完成
   - 點擊連結即可瞬間開啟

3. **智慧分頁跳轉**
   - 當目標頁面已在目前視窗開啟時
   - 點擊連結會自動跳轉到已有分頁
   - 不會重複開啟相同的頁面

4. **查看統計**
   - 點擊擴充功能圖示
   - 切換到「統計」分頁
   - 查看預載入效果和節省的時間

### Tab-out 新分頁

1. **啟用 Tab-out**
   - 開啟設定面板
   - 在「進階功能」中開啟「Tab-out 新分頁」
   - 開啟新分頁即可看到管理面板

2. **使用收藏**
   - 點擊左上角「+」按鈕加入收藏
   - 右鍵點擊分頁選擇「加入到收藏」
   - 收藏會持久保存，方便快速存取

3. **管理分頁**
   - 中間欄顯示所有開啟的分頁（依網域分組）
   - 點擊分頁可跳轉到對應頁面
   - 點擊「×」可關閉分頁或整個網域組

### 進階設定

#### 調整懸停延遲
- 開啟設定面板
- 拖動「懸停延遲」滑桿
- 建議值：100-300ms

#### 設定預載入數量
- 開啟設定面板
- 拖動「最大預載入數」滑桿
- 建議值：3-5個

#### 選擇預載入模式
- **預載入視窗模式**：完整預載入，體驗最佳（推薦）
- **iframe 模式**：輕量級，相容性好

#### 啟用快速鍵
- 開啟設定面板
- 開啟「啟用快速鍵」選項
- 使用 `Alt+P` 開關預載入，`Alt+C` 清理快取
- 可在 Chrome 快速鍵設定中自訂快速鍵

#### 網站規則管理
1. 切換到「網站規則」分頁
2. 點擊「新增規則」按鈕
3. 輸入網域（如：example.com）
4. 設定啟用或停用狀態

---

## ⚙️ 工作原理

### 預載入流程

```
使用者懸停連結
    ↓
等待延遲時間
    ↓
檢查網路狀態
    ↓
檢查網站規則
    ↓
建立預載入視窗
    ↓
在預載入視窗中開啟分頁
    ↓
最小化預載入視窗
    ↓
使用者點擊連結
    ↓
將分頁移動到主視窗
    ↓
啟用分頁
    ↓
完成！
```

### 技術架構

- **Content Script** - 監聽頁面連結事件，觸發預載入
- **Background Service Worker** - 管理預載入視窗和分頁
- **Popup UI** - 提供設定介面和統計資訊
- **Chrome Storage API** - 持久化設定和統計資料

### 預載入視窗技術

擴充功能使用獨立的預載入視窗來預載入頁面：

1. 建立一個小型的 normal 類型視窗
2. 立即最小化該視窗
3. 在視窗中建立預載入分頁
4. 使用者點擊時將分頁移動到主視窗
5. 啟用分頁並聚焦主視窗

這種方式的優勢：
- ✅ 完整預載入頁面（包括 JavaScript、CSS、圖片等）
- ✅ 主視窗完全不受影響
- ✅ 分頁可以無縫移動
- ✅ 支援所有網站和複雜頁面

---

## 🎨 介面預覽

### 設定面板
- 簡潔的開關控制
- 直觀的滑桿調節
- 即時預載入清單
- 附近連結顯示

### 統計面板
- 總預載入次數
- 命中率百分比
- 節省時間統計
- 工作階段時長顯示

### 網站規則
- 網域清單管理
- 啟用/停用狀態
- 快速新增/刪除

---

## 🔧 設定選項

| 選項 | 說明 | 預設值 | 建議值 |
|------|------|--------|--------|
| 啟用預載入 | 總開關 | 開啟 | 開啟 |
| 懸停延遲 | 滑鼠懸停多久後觸發預載入 | 100ms | 100-300ms |
| 最大預載入數 | 同時預載入的最大數量 | 5 | 3-5 |
| 預載入模式 | 預載入方式 | 預載入視窗 | 預載入視窗 |
| 網路感知 | 根據網路狀態調整 | 開啟 | 開啟 |
| 顯示指示器 | 顯示預載入狀態圓點 | 開啟 | 開啟 |
| 預載入靜音 | 預載入分頁預設靜音 | 開啟 | 開啟 |
| 智慧分頁去重 | 偵測並跳轉到已開啟的分頁 | 開啟 | 開啟 |
| Tab-out 新分頁 | 啟用新分頁管理面板 | 關閉 | 按需 |
| 快速鍵 | 啟用 Alt+P / Alt+C | 關閉 | 按需 |

---

## ❓ 常見問題

### Q: 預載入會消耗很多流量嗎？
A: 擴充功能會智慧偵測網路狀態，在慢速網路下自動減少預載入。您也可以透過調整「最大預載入數」來控制流量消耗。

### Q: 預載入會影響瀏覽器效能嗎？
A: 預載入使用獨立視窗，對主視窗效能影響極小。同時擴充功能會自動清理過期的預載入內容。

### Q: 為什麼有些網站預載入失敗？
A: 某些網站可能有防護機制。您可以在「網站規則」中為這些網站停用預載入。

### Q: 如何知道連結已經預載入？
A: 啟用「顯示指示器」後，預載入完成的連結旁會顯示綠色圓點。

### Q: 預載入視窗會顯示出來嗎？
A: 不會。預載入視窗會立即最小化，完全不影響您的瀏覽體驗。

### Q: 可以為特定網站停用預載入嗎？
A: 可以。在「網站規則」分頁中新增網域規則，或右鍵點擊頁面選擇「在此網站啟用/停用預載入」。

### Q: 什麼是智慧分頁去重？
A: 當您要點擊的連結已經在目前視窗開啟時，擴充功能會自動跳轉到已有的分頁，而不是重新開啟。這樣可以避免重複分頁，節省記憶體。

### Q: 什麼是 Tab-out？
A: Tab-out 是一個美觀的新分頁管理面板，可以顯示您開啟的所有分頁（依網域分組）、收藏常用網站、管理稍後閱讀等。

### Q: 預載入的分頁會發出聲音嗎？
A: 不會。預載入分頁預設靜音，避免影片或直播網站自動播放出聲。啟用後您可以在網址列點擊解除靜音。

### Q: 快速鍵為什麼不起作用？
A: 快速鍵預設是關閉的，需要在設定中手動啟用。這是為了避免與系統或其他擴充功能的快速鍵衝突。

---

## 🚀 版本歷史

### v2.1.0 (目前版本)
- ✨ **智慧分頁去重與跳轉** - 預載入前偵測目前視窗是否已開啟目標網頁，點擊時優先跳轉到已有分頁
- ✨ **Tab-out 新分頁管理** - 美觀的新分頁面板，支援網域分組、收藏、分頁數量徽章
- ✨ **預載入靜音** - 預載入分頁預設靜音，避免自動播放出聲
- ✨ **快速鍵衝突偵測** - 自動偵測並提示快速鍵衝突
- ✨ **多語言支援** - 支援簡體中文、繁體中文、英文介面
- ✨ **LRU 快取淘汰** - 超出預載入上限時自動淘汰最久未使用的內容
- ✨ **預設網站規則** - 預置抖音等影片網站預設停用預載入
- 🔧 最佳化預載入視窗管理，支援多視窗複用
- 🔧 最佳化分頁追蹤和清理邏輯

### v2.0.0
- ✨ 全新的預載入視窗技術
- ✨ 智慧分頁管理
- ✨ 網站規則系統
- ✨ 統計與分析功能
- ✨ 網路感知最佳化
- ✨ 視覺指示器
- ✨ 深色模式支援
- ✨ 快速鍵支援
- ✨ 右鍵選單整合

### v1.4.6
- 🔧 分頁重複偵測
- 🔧 自動跳轉功能

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！



### 專案結構

```
webpremium/
├── manifest.json          # 擴充功能設定檔
├── background.js          # 背景服務指令碼進入點
├── content.js             # 內容指令碼進入點
├── popup.html             # 彈出視窗 HTML
├── popup.js               # 彈出視窗指令碼進入點
├── popup.css              # 彈出視窗樣式
├── index.html             # Tab-out 新分頁 HTML
├── app.js                 # Tab-out 新分頁邏輯
├── style.css              # Tab-out 新分頁樣式
├── icons/                 # 圖示檔案
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── src/                   # 模組化原始碼
│   ├── background/        # 背景模組
│   │   ├── preload-window.js   # 預載入視窗管理
│   │   ├── router.js           # 訊息路由
│   │   ├── settings-store.js   # 設定儲存
│   │   ├── site-rules.js       # 網站規則
│   │   ├── stats.js            # 統計
│   │   ├── tab-deduper.js      # 分頁去重
│   │   ├── tab-out.js          # Tab-out 功能
│   │   └── tab-tracker.js      # 分頁追蹤
│   ├── content/           # 內容指令碼模組
│   │   ├── indicator.js        # 視覺指示器
│   │   ├── link-tracker.js     # 連結追蹤
│   │   ├── main.js             # 主進入點
│   │   ├── network-aware.js    # 網路感知
│   │   ├── preloader.js        # 預載入器
│   │   └── settings.js         # 設定管理
│   ├── popup/             # 彈窗模組
│   │   ├── api.js              # API 封裝
│   │   ├── dom.js              # DOM 工具
│   │   ├── i18n.js             # 國際化
│   │   ├── rules-view.js       # 規則檢視
│   │   ├── settings-view.js    # 設定檢視
│   │   ├── stats-view.js       # 統計檢視
│   │   ├── tabs.js             # Tab 切換
│   │   ├── theme.js            # 主題
│   │   └── toast.js            # 提示訊息
│   └── shared/            # 共用模組
│       ├── constants.js        # 常數
│       ├── logger.js           # 日誌
│       └── url-utils.js        # URL 工具
└── README.md              # 說明文件
```

---

## 📄 授權條款

Mozilla Public License Version 2.0

本專案採用 MPL-2.0 授權條款。詳情請查看 [LICENSE](../../LICENSE) 檔案。

---

## 💬 回饋與支援

- 🐛 [回報 Bug](https://github.com/Yikumasai/webpremium/issues)
- 💡 [功能建議](https://github.com/Yikumasai/webpremium/issues)
- 📧 電子郵件：likanglin2001@qq.com

---

## 🌟 致謝

感謝所有使用和支援 Webpremium 的使用者！

如果這個專案對您有幫助，請給我們一個 ⭐️ Star！

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

**讓瀏覽更快，讓體驗更好**

Made with ❤️ by Webpremium

</div>


