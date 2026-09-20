"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pricingService_1 = require("../services/pricingService");
const discountService_1 = require("../services/discountService");
const router = (0, express_1.Router)();
// POST /api/pricing/calculate
router.post('/calculate', (req, res) => {
    const { originalPrice, currency, discountPercentage } = req.body;
    const result = pricingService_1.pricingService.calculatePrice(originalPrice, currency || 'INR', null, discountPercentage);
    res.json({ success: true, data: result });
});
// POST /api/discounts/apply
router.post('/apply', (req, res) => {
    const { merchantId, couponCode, orderValue } = req.body;
    if (!couponCode || !orderValue) {
        return res.status(400).json({ success: false, error: 'couponCode and orderValue are required.' });
    }
    const validation = discountService_1.discountService.validateCoupon(merchantId || 'merchant_001', couponCode, orderValue);
    if (!validation.isValid) {
        return res.status(400).json({ success: false, error: validation.message });
    }
    const result = pricingService_1.pricingService.calculatePrice(orderValue, 'INR', validation.rule);
    res.json({ success: true, message: validation.message, data: result });
});
exports.default = router;
