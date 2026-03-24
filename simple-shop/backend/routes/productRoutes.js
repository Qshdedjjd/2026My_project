const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth"); // 引入警衛
const multer = require('multer');
const path = require('path');
const Product = require("../models/Product"); // 👈 記得引入 Model，否則會報錯

// 1. 設定儲存邏輯
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- 路由設定 ---

// 公開路由：大家都能看商品
router.get("/", productController.getProducts);

// 2. 新增商品：整合「警衛(auth)」與「圖片上傳(upload)」
// 執行順序：先檢查 Token (auth) -> 處理圖片 (upload) -> 儲存資料
router.post("/", auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : ""; 
    
    const newProduct = new Product({ 
      name, 
      description, 
      price, 
      stock, 
      imageUrl  // 存入圖片路徑
    });
    
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. 更新商品：同樣需要 auth 和 upload
router.put("/:id", auth, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. 刪除商品
router.delete("/:id", auth, productController.deleteProduct);

module.exports = router;