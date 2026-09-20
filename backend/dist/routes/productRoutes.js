"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productService_1 = require("../services/productService");
const router = (0, express_1.Router)();
// GET /api/products/search
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q || '';
        const category = req.query.category;
        const color = req.query.color;
        const size = req.query.size;
        const products = await productService_1.productService.searchProducts(query, category, color, size);
        res.json({ success: true, count: products.length, data: products });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// GET /api/products
router.get('/', async (req, res) => {
    try {
        const products = await productService_1.productService.getProducts();
        res.json({ success: true, count: products.length, data: products });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await productService_1.productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.json({ success: true, data: product });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
exports.default = router;
