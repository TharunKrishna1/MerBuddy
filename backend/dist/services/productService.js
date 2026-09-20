"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const mockStoreService_1 = require("./mockStoreService");
const shopifyService_1 = require("./shopifyService");
class ProductService {
    isMockMode() {
        return process.env.MOCK_STORE !== 'false';
    }
    async getProducts() {
        if (this.isMockMode()) {
            return mockStoreService_1.mockStoreService.getAllProducts();
        }
        try {
            return await shopifyService_1.shopifyService.fetchProductsFromGraphQL();
        }
        catch (err) {
            console.warn('Shopify GraphQL fetch failed, falling back to mock store:', err);
            return mockStoreService_1.mockStoreService.getAllProducts();
        }
    }
    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }
    async searchProducts(query, category, color, size) {
        if (this.isMockMode()) {
            return mockStoreService_1.mockStoreService.searchProducts(query, category, color, size);
        }
        try {
            const shopifyProds = await shopifyService_1.shopifyService.fetchProductsFromGraphQL(query);
            if (shopifyProds.length > 0)
                return shopifyProds;
            return mockStoreService_1.mockStoreService.searchProducts(query, category, color, size);
        }
        catch (err) {
            return mockStoreService_1.mockStoreService.searchProducts(query, category, color, size);
        }
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
