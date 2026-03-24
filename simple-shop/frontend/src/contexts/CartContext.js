import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. 創建 Context 物件
const CartContext = createContext();

// 2. 建立 Provider 元件
export const CartProvider = ({ children }) => {
  // 初始化：從 localStorage 讀取舊有的購物車資料
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 監聽：每當 cartItems 改變，就存入 localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 功能：加入購物車
  const addToCart = (product) => {
    setCartItems(prev => {
      const existItem = prev.find(item => item._id === product._id);
      if (existItem) {
        return prev.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 功能：增加/減少數量
  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  // 功能：移除商品
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  // 計算：總金額
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. 自定義 Hook 方便其他元件呼叫
export const useCart = () => useContext(CartContext);