import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import "./App.css";

const BASE_URL = "https://simple-shop-backend.onrender.com";
const API_URL = `${BASE_URL}/api/products`;

/**
 * 🛠️ 工具函數：處理圖片網址
 * 1. 解決雙斜線 // 問題
 * 2. 如果沒有路徑則回傳空字串
 */
const getFullImageUrl = (path) => {
  if (!path || path === "無") return "";
  const fullUrl = `${BASE_URL}/${path}`;
  return fullUrl.replace(/([^:]\/)\/+/g, "$1");
};

const AlertFactory = ({ type, message }) => {
  const styles = {
    success: { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
    danger: { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" }
  };
  return (
    <div style={{ ...styles[type], padding: "15px", marginBottom: "20px", borderRadius: "8px", textAlign: "center" }}>
      {message}
    </div>
  );
};

function ProductManager() {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 控制側邊欄開關
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", category: "未分類" });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterCategory, setFilterCategory] = useState("全部");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) { console.error("讀取商品失敗", err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "全部" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterCategory]);

  const exportToCSV = () => {
    const headers = ["商品名稱,價格,庫存,分類"];
    const rows = filteredProducts.map(p => 
      `"${p.name}",${p.price},${p.stock},"${p.category || '未分類'}"`
    );
    const csvContent = headers.concat(rows).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `庫存報表_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? filteredProducts.map(p => p._id) : []);
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBatchDelete = async () => {
    if (window.confirm(`確定要刪除這 ${selectedIds.length} 項商品嗎？`)) {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      try {
        await Promise.all(selectedIds.map(id => axios.delete(`${API_URL}/${id}`, config)));
        setAlert({ show: true, message: "🗑️ 批次刪除成功", type: "danger" });
        setSelectedIds([]);
        fetchProducts();
      } catch (err) { setAlert({ show: true, message: "部分刪除失敗", type: "danger" }); }
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({ 
        name: product.name, 
        description: product.description || "", 
        price: product.price, 
        stock: product.stock,
        category: product.category || "未分類" 
    });
    // 編輯時處理預覽圖：有圖顯示圖，沒圖就清空預覽
    const imgUrl = getFullImageUrl(product.imageUrl);
    setPreview(imgUrl); 
  };

  const handleDelete = async (id) => {
    if (window.confirm("確定要刪除嗎？")) {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      try {
        await axios.delete(`${API_URL}/${id}`, config);
        fetchProducts();
        setAlert({ show: true, message: " 商品已成功刪除", type: "danger" });
      } catch (err) { setAlert({ show: true, message: "刪除失敗", type: "danger" }); }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", Number(form.price));
    formData.append("stock", Number(form.stock));
    formData.append("category", form.category);
    
    if (file) {
      formData.append("image", file);
    }

    const config = { 
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
        "Content-Type": "multipart/form-data" 
      } 
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, config);
        setEditingId(null);
        setAlert({ show: true, message: "✅ 商品更新成功！", type: "success" });
      } else {
        await axios.post(API_URL, formData, config);
        setAlert({ show: true, message: "✅ 商品新增成功！", type: "success" });
      }
      setForm({ name: "", description: "", price: "", stock: "", category: "未分類" });
      setFile(null); 
      setPreview(""); 
      fetchProducts();
    } catch (err) {
      setAlert({ show: true, message: `❌ 提交失敗: ${err.response?.data?.message || "格式錯誤"}`, type: "danger" });
    }
  };

  return (
    <div className={isDark ? "dark-theme container" : "light-theme container"}>
      {/* 1. 遮罩 (只有選單打開時才出現) */}
    {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

    {/* 2. 修改原本的側邊欄 (加上 open 判斷) */}
    <div className={`sidebar ${isMenuOpen ? "open" : ""}`}></div>
      
        <h3 className="sidebar-logo">SELLER CENTER</h3>
        <button className={`sidebar-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}> 商品管理</button>
        <button className={`sidebar-item ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}> 數據中心</button>
        <button className={`sidebar-item ${activeTab === 'shop' ? 'active' : ''}`} 
          onClick={() => setActiveTab('shop')} >買家視角 (前台)
        </button>
        <button className="theme-toggle-btn" onClick={() => setIsDark(!isDark)}>{isDark ? " 淺色" : " 深色"}</button>
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={() => { localStorage.removeItem("token"); window.location.reload(); }}>登出系統</button>
       
      </div>

      <div className="main-content">
        <div className="top-bar">
          {/* 3. 漢堡按鈕 (三條線) */}
          <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>

        {activeTab === 'products' && (
          <>
            <h2> 商品管理控制台</h2>
            {alert.show && <AlertFactory type={alert.type} message={alert.message} />}
            
            <form onSubmit={handleSubmit} className="product-form">
              <input name="name" placeholder="商品名稱" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              <input name="price" type="number" placeholder="價格" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
              <input name="stock" type="number" placeholder="庫存" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} required />
              
              <select className="category-select" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                <option value="未分類"> 選擇分類</option>
                <option value="電子產品"> 電子產品</option>
                <option value="生活用品"> 生活用品</option>
                <option value="服飾配件"> 服飾配件</option>
                <option value="食品飲料"> 食品飲料</option>
              </select>

              <div className="file-input-wrapper" style={{ gridColumn: "1 / -1", textAlign: "left", marginTop: "10px" }}>
                <label style={{ fontSize: "14px", color: "var(--text-muted)" }}> 上傳商品圖片：</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {preview ? (
                  <div style={{ marginTop: "10px" }}>
                    <img src={preview} alt="預覽圖" style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--border-color)" }} />
                  </div>
                ) : (
                  <div style={{ marginTop: "10px", color: "var(--text-muted)", fontSize: "14px" }}>目前狀態：無圖片</div>
                )}
              </div>

              <button type="submit" style={{ gridColumn: "1 / -1" }}>
                {editingId ? " 更新商品資訊" : "➕ 新增商品資訊"}
              </button>
            </form>

            <div className="action-bar">
              <input className="search-input" placeholder=" 搜尋商品名稱..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <select className="category-filter" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="全部"> 所有分類</option>
                <option value="電子產品"> 電子產品</option>
                <option value="生活用品"> 生活用品</option>
                <option value="服飾配件"> 服飾配件</option>
                <option value="食品飲料"> 食品飲料</option>
              </select>
              {selectedIds.length > 0 && (
                <button className="btn-batch-delete" onClick={handleBatchDelete} style={{ background: '#ef4444', color: 'white' }}>🗑️ 刪除 ({selectedIds.length})</button>
              )}
              <button onClick={exportToCSV} className="btn-edit"  >匯出 CSV</button>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0} /></th>
                    <th>圖片</th><th>名稱</th><th>價格</th><th>庫存</th><th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((product) => (
                    <tr key={product._id} className={selectedIds.includes(product._id) ? "selected-row" : ""}>
                      <td><input type="checkbox" checked={selectedIds.includes(product._id)} onChange={() => handleSelectOne(product._id)} /></td>
                      {/* 🌟 這裡實現你要求的「無」的存在 */}
                      <td>
                        {product.imageUrl && product.imageUrl !== "無" ? (
                          <img src={getFullImageUrl(product.imageUrl)} className="product-img" alt={product.name} />
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>無</span>
                        )}
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                        <div className="category-tag">{product.category || "未分類"}</div>
                      </td>
                      <td>${product.price}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ color: product.stock < 5 ? '#ff4d4f' : 'inherit', fontWeight: product.stock < 5 ? '700' : '500' }}>{product.stock}</span>
                          {product.stock === 0 ? <span className="badge badge-soldout">已售罄</span> : product.stock < 5 ? <span className="badge badge-low">需補貨</span> : <span className="badge badge-instock">充足</span>}
                        </div>
                      </td>
                      <td>
                        <button className="btn-edit" onClick={() => handleEdit(product)}>編輯</button>
                        <button className="btn-delete" onClick={() => handleDelete(product._id)}>刪除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination-wrapper">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="btn-page">上一頁</button>
                <span className="page-info">頁次 {currentPage} / {totalPages || 1}</span>
                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="btn-page">下一頁</button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'data' && (
          <div className="data-center" >
            <h2 style={{ marginBottom: '30px' }}> 營運數據</h2>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="stat-card" style={{ gridColumn: '1 / -1', minHeight: '400px' }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '20px' }}> 商品分類佔比分析</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(
                        products.reduce((acc, p) => ({ ...acc, [p.category || "未分類"]: (acc[p.category || "未分類"] || 0) + 1 }), {})
                      ).map(([name, value]) => ({ name, value }))}
                      cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value"
                    >
                      {[ '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6' ].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
                <h4 style={{ color: '#ef4444', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>⚠️ 庫存低於安全水位 (5件以下)</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '14px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '12px' }}>商品名稱</th>
                        <th style={{ padding: '12px' }}>剩餘庫存</th>
                        <th style={{ padding: '12px' }}>所屬分類</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.filter(p => p.stock < 5).length > 0 ? (
                        products.filter(p => p.stock < 5).map(p => (
                          <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '12px', color: 'var(--text-main)' }}>{p.name}</td>
                            <td style={{ padding: '12px', color: '#ef4444', fontWeight: '800' }}>{p.stock}</td>
                            <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{p.category}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#10b981', fontWeight: '600' }}>太棒了！目前所有商品庫存皆在安全範圍。</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="shop-container" style={{ width: '100%', maxWidth: '1100px', paddingBottom: '50px' }}>
            <h2 style={{ marginBottom: '30px', textAlign: 'center' }}> 精選商品展示 (前台預覽)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
              {products.map(p => (
                <div key={p._id} className="stat-card" style={{ 
                    position: 'relative', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease',
                    backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--border-color)' 
                  }}>
                  {p.stock === 0 && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, fontWeight: '800', fontSize: '24px', letterSpacing: '2px' }}>SOLD OUT</div>
                  )}
                  {/* 🌟 買家視角：無圖片時顯示灰色背景+文字 */}
                  <div style={{ width: '100%', height: '220px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {p.imageUrl && p.imageUrl !== "無" ? (
                      <img src={getFullImageUrl(p.imageUrl)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: "#64748b", fontWeight: "600" }}>無圖片</span>
                    )}
                  </div>
                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: 'bold', textTransform: 'uppercase' }}>{p.category || "未分類"}</span>
                    <h3 style={{ margin: '8px 0', fontSize: '18px', color: 'var(--text-main)' }}>{p.name}</h3>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '22px', fontWeight: '800', color: '#10b981' }}>${p.price}</span>
                      <button onClick={() => alert(`已將 ${p.name} 加入購物車！`)} disabled={p.stock === 0} style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', backgroundColor: p.stock === 0 ? '#475569' : '#6366f1', color: 'white', fontWeight: '700', cursor: p.stock === 0 ? 'not-allowed' : 'pointer' }}>
                        {p.stock === 0 ? "已售罄" : "加入購物車"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductManager;