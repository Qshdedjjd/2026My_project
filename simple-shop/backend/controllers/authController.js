const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 註冊邏輯
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // 密碼加密
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "使用者註冊成功" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 登入邏輯
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "帳號或密碼錯誤" });
    }
    // 核發 Token，有效期限 1 小時
    const token = jwt.sign({ id: user._id }, "YOUR_SECRET_KEY", { expiresIn: "1h" });
    res.json({ token, username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};