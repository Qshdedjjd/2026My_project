const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "拒絕存取，請先登入" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), "YOUR_SECRET_KEY");
    req.user = verified;
    next(); // 有 Token，放行！
  } catch (err) {
    res.status(400).json({ message: "無效的 Token" });
  }
};