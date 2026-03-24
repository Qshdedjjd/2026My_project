// backend/services/productService.js
const productRepository = require("../repositories/productRepository"); // 引入 Repository

class ProductService {
  async getAllProducts() {
    return await productRepository.findAll();
  }

  async getProductById(id) {
    return await productRepository.findById(id);
  }

  async createProduct(productData) {
    // 可以在這裡加入額外的商業邏輯，例如：庫存檢查、價格計算等
    return await productRepository.create(productData);
  }

  async updateProduct(id, productData) {
    // 可以在這裡加入額外的商業邏輯
    return await productRepository.update(id, productData);
  }

  async deleteProduct(id) {
    // 可以在這裡加入額外的商業邏輯
    return await productRepository.delete(id);
  }
}

module.exports = new ProductService(); // Singleton Pattern 應用