"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsService_1 = require("../services/analyticsService");
const router = (0, express_1.Router)();
// GET /api/analytics
router.get('/', (req, res) => {
    const merchantId = req.query.merchantId;
    const summary = analyticsService_1.analyticsService.getAnalyticsSummary(merchantId);
    res.json({ success: true, data: summary });
});
exports.default = router;
