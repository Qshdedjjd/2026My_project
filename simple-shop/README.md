#  全端庫存管理與電商預覽系統

##  核心亮點
- **數據戰情室**：整合 `Recharts` 實作動態分析，自動化分類佔比。
- **即時庫存連動**：買家視角會根據後台庫存自動顯示「SOLD OUT」遮罩。
- **全端進階功能**：JWT 驗證、圖片上傳、批次刪除、CSV 導出。

##  加分項目實作說明
- **身份驗證**：實作 JWT (JSON Web Token) 權限控管，保護後端 API。
- **設計模式 (Factory Pattern)**：前端 `AlertFactory` 根據狀態動態生成通知元件。
- **設計模式 (MVC)**：後端嚴格區分 Routes, Controllers, Models 結構。

##  技術棧
- 前端：React, Axios, Recharts, CSS Variables
- 後端：Node.js, Express, Multer
- 資料庫：MongoDB

##  快速開始
1. **設定環境**：於 `backend/` 新增 `.env` 並填入 `MONGO_URI`。
2. **安裝依賴**：於根目錄執行 `npm install`。
3. **啟動後端**：`cd backend && nodemon server.js`
4. **啟動前端**：`cd frontend && npm start`

##  專案架構與文件
- 系統架構圖與流程圖：請參閱 `docs/` 資料夾。
- API 規格說明：請參閱 `docs/api-spec.md`。