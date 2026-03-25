#  MERN 全棧商品管理與電商預覽系統
### MERN Full-stack Inventory Management & E-commerce Preview System

這是一個基於 **MERN Stack** (MongoDB, Express, React, Node.js) 開發的響應式管理系統，旨在提供商家一個直覺的後台控管介面，並同步提供買家視角的商品展示功能。

##  線上展示 
- **前端預覽**: [https://simple-shop-fronted.onrender.com]
- **後端 API**: [https://simple-shop-backend.onrender.com]

##  核心亮點
- **商品管理**: 支援商品的新增、編輯、刪除（CRUD）與批次刪除功能。
- **圖片上傳系統**: 整合 Multer 處理實體圖片上傳，並具備「無圖片」自動偵測與預覽邏輯。
- **數據視覺化**: 使用 Recharts 繪製分類佔比圓餅圖，直觀掌握庫存分佈。
- **即時庫存連動**：買家視角會根據後台庫存自動顯示「SOLD OUT」遮罩。
- **買家預覽**: 一鍵切換「買家視角」，模擬電商前台展示效果。
- **深色/淺色模式**: 支援響應式 UI 主題切換。
- **報表匯出**: 支援將商品資料一鍵匯出為 CSV 檔案。
- **全端進階功能**：JWT 驗證、圖片上傳、批次刪除、CSV 導出。

##  加分項目實作說明
- **身份驗證**：實作 JWT (JSON Web Token) 權限控管，保護後端 API。
- **設計模式 (Factory Pattern)**：前端 `AlertFactory` 根據狀態動態生成通知元件。
- **設計模式 (MVC)**：後端嚴格區分 Routes, Controllers, Models 結構。

##  技術棧
- 前端：React, Axios, Recharts, CSS Variables
- 後端：Node.js, Express, Multer
- 資料庫：MongoDB Atlas
- 部署平台: Render


##  專案架構與文件
- 系統架構圖與流程圖：請參閱 `docs/` 資料夾。
- API 規格說明：請參閱 `docs/api-spec.md`。

##  注意事項
- 本系統目前部署於 Render 免費方案，若初次連線較慢，請靜候 30-60 秒喚醒伺服器。
- 圖片上傳目前儲存於伺服器靜態目錄，伺服器重啟時圖片可能會清空（開發測試階段）。