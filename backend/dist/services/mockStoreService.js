"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockStoreService = exports.MockStoreService = void 0;
const mockProducts_1 = require("../data/mockProducts");
class MockStoreService {
    products = mockProducts_1.mockProducts;
    getAllProducts() {
        return this.products;
    }
    getProductById(id) {
        return this.products.find(p => p.id === id);
    }
    searchProducts(query, category, color, size) {
        const q = query.toLowerCase().trim();
        return this.products.filter(p => {
            const matchText = (p.title + ' ' + p.description + ' ' + p.tags.join(' ')).toLowerCase();
            const matchesQuery = !q || matchText.includes(q) || p.category.toLowerCase().includes(q);
            const matchesCategory = !category || p.category.toLowerCase() === category.toLowerCase();
            let matchesVariant = true;
            if (color || size) {
                matchesVariant = p.variants.some(v => {
                    const colorMatch = !color || (v.color && v.color.toLowerCase() === color.toLowerCase());
                    const sizeMatch = !size || (v.size && v.size.toString() === size.toString());
                    return colorMatch && sizeMatch;
                });
            }
            return matchesQuery && matchesCategory && matchesVariant;
        });
    }
}
exports.MockStoreService = MockStoreService;
exports.mockStoreService = new MockStoreService();
