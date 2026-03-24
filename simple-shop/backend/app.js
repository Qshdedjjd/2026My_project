const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();
const authRoutes = require("./routes/authRoutes"); // 1. 引入認證路由
const path = require('path'); // 確保檔案頂部有引入 path



// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes); // 2. 註冊登入/註冊接口
//  加入這一行，讓前端可以讀取上傳的圖片
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/products", productRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

