#  API 接口規格文件

## 商品管理 (Product API)

### 1. 取得所有商品
- **Endpoint**: `GET /api/products`
- **Auth**: None
- **Response**: `Array<Product>`

### 2. 新增商品
- **Endpoint**: `POST /api/products`
- **Auth**: Required (JWT Bearer Token)
- **Content-Type**: `multipart/form-data`
- **Body**: `{ name, price, stock, category, image }`

### 3. 更新商品
- **Endpoint**: `PUT /api/products/:id`
- **Auth**: Required (JWT)

### 4. 刪除商品 (單一/批次)
- **Endpoint**: `DELETE /api/products/:id`
- **Auth**: Required (JWT)