#  會員註冊系統 - 前端進階驗證實作
### Member Registration System with Advanced Validation & A11y

這是一個著重於 **使用者體驗 (UX)**、**互動設計** 與 **網頁無障礙 (Accessibility)** 的會員註冊表單專案。除了基本的資料蒐集，本專案深入實作了多維度的前端驗證邏輯。

---

##  核心技術亮點 (Technical Highlights)

### 1. 視覺化密碼強度偵測 (Password Strength Meter)
* **動態回饋**：利用 JavaScript 即時分析密碼複雜度（長度、大小寫、數字、特殊符號）。
* **UI 連動**：同步更新 `strength-bar` 的長度與顏色，並提供文字提示，引導使用者設定安全的密碼。

### 2. 高標無障礙設計 (Web Accessibility)
* **語意化結構**：使用 `<main>`, `<fieldset>`, `<legend>` 確保畫面結構清晰。
* **A11y 支援**：全面導入 `aria-describedby` 屬性，將輸入框與錯誤訊息關聯，確保螢幕閱讀器（Screen Reader）使用者能獲取精確的錯誤提示。

### 3. 自定義邏輯驗證 (Custom Validation)
* **一致性檢查**：實作「確認密碼」比對邏輯，確保兩次輸入完全相同。
* **群組選取限制**：針對興趣標籤（Checkbox Group）實作「至少選取一項」的邏輯判斷。
* **正則表達式 (RegEx)**：嚴格校驗手機號碼格式（10位數字）與 Email 格式。

### 4. 即時互動體驗 (Real-time Feedback)
* 透過監聽 `input` 事件，在使用者輸入時立即清除或顯示錯誤訊息，避免傳統表單「送出後才報錯」的挫折感。

---

##  技術棧 (Tech Stack)

* **HTML5**: 語意化標籤、ARIA 屬性、Novalidate 原生驗證禁用。
* **CSS3**: Flexbox 佈局、動態能量條動畫、錯誤狀態視覺化。
* **Vanilla JavaScript**: 原生 DOM 操作、事件委派、正規表示式運用。

---

##  檔案結構 (Project Structure)

```text
project/
├── index.html        # 結構化表單內容與 ARIA 標註
├── styles.css        # 響應式排版與互動樣式
└── signup_form.js    # 核心驗證邏輯與強度演算法