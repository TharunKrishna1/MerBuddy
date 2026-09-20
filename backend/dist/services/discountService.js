"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discountService = exports.DiscountService = void 0;
const mockProducts_1 = require("../data/mockProducts");
class DiscountService {
    discountRules = mockProducts_1.mockDiscountRules;
    getRulesByMerchant(merchantId) {
        return this.discountRules.filter(r => r.merchantId === merchantId && r.active);
    }
    validateCoupon(merchantId, code, orderValue) {
        const cleanCode = code.trim().toUpperCase();
        const rule = this.discountRules.find(r => r.merchantId === merchantId && r.code.toUpperCase() === cleanCode && r.active);
        if (!rule) {
            return { isValid: false, message: `Coupon code '${code}' is invalid or expired.` };
        }
        if (rule.minOrderValue && orderValue < rule.minOrderValue) {
            return {
                isValid: false,
                rule,
                message: `Coupon '${code}' requires a minimum order value of ₹${rule.minOrderValue.toLocaleString('en-IN')}.`
            };
        }
        return {
            isValid: true,
            rule,
            message: `Coupon '${code}' applied successfully.`
        };
    }
}
exports.DiscountService = DiscountService;
exports.discountService = new DiscountService();
