import React, { useState } from "react";
import ProductManager from "./ProductManager";
import Login from "./Login"; // 確保你有建立這個檔案
import { CartProvider } from './contexts/CartContext';

function App() {
  // 用來儲存登入後的 Token
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <CartProvider>
    <div className="App">
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <button 
            onClick={handleLogout} 
            style={{ float: 'right', margin: '20px', padding: '10px', cursor: 'pointer' }}
          >
            登出
          </button>
          <ProductManager token={token} />
        </>
      )}
    </div>
    </CartProvider>
  );
}

export default App;