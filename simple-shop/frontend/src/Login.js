import React, { useState } from "react";
import axios from "axios";

function Login({ setToken }) {
  const [user, setUser] = useState({ username: "", password: "" });
  // ✅ 統一使用 msg 狀態，包含文字內容與類型（成功或失敗）
  const [msg, setMsg] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", user);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      // ✅ 使用正確的 setMsg
      setMsg({ text: "登入失敗：帳號或密碼錯誤", type: "error" });
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", user);
      // ✅ 使用正確的 setMsg
      setMsg({ text: "註冊成功！現在您可以登入了", type: "success" });
    } catch (err) {
      setMsg({ text: "註冊失敗：帳號可能已存在", type: "error" });
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
      <h2 style={{ textAlign: 'center' }}>商城管理登入</h2>
      
      {/* ✅ 根據 type 顯示不同顏色的訊息 */}
      {msg.text && (
        <p style={{ color: msg.type === "success" ? "#27ae60" : "#e74c3c", textAlign: 'center', fontWeight: 'bold' }}>
          {msg.text}
        </p>
      )}
      
      <form onSubmit={handleSubmit} className="product-form" style={{ gridTemplateColumns: '1fr' }}>
        <input 
          placeholder="管理員帳號" 
          onChange={e => setUser({...user, username: e.target.value})} 
          required 
        />
        <input 
          type="password" 
          placeholder="管理員密碼" 
          onChange={e => setUser({...user, password: e.target.value})} 
          required 
        />
        <button type="submit">確認登入</button>
        
        <button 
          type="button" 
          onClick={handleRegister}
          style={{ backgroundColor: '#2ecc71', marginTop: '10px' }}
        >
          第一次使用？點此註冊帳號
        </button>
      </form>
    </div>
  );
}

export default Login;