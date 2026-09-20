"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const evalService_1 = require("../services/evalService");
const mockMerchants_1 = require("../data/mockMerchants");
const router = (0, express_1.Router)();
// GET /api/evaluations
router.get('/', (req, res) => {
    const merchantId = req.query.merchantId;
    const testCases = evalService_1.evalService.getTestCases(merchantId);
    const results = evalService_1.evalService.getResults(merchantId);
    res.json({ success: true, count: results.length, testCases, data: results });
});
// GET /api/evaluations/:id
router.get('/:id', (req, res) => {
    const results = evalService_1.evalService.getResults();
    const found = results.find(r => r.id === req.params.id || r.testId === req.params.id);
    if (!found) {
        return res.status(404).json({ success: false, error: 'Evaluation result not found' });
    }
    res.json({ success: true, data: found });
});
// POST /api/evaluations/run
router.post('/run', async (req, res) => {
    try {
        const { merchantId = 'merchant_001', promptId } = req.body;
        const merchant = mockMerchants_1.mockMerchants.find(m => m.id === merchantId) || mockMerchants_1.mockMerchants[0];
        const results = await evalService_1.evalService.runEvaluations(merchant, promptId);
        const total = results.length;
        const passed = results.filter(r => r.passed).length;
        res.json({
            success: true,
            summary: {
                totalTests: total,
                passed,
                failed: total - passed,
                passRatePercentage: Math.round((passed / total) * 100)
            },
            data: results
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
exports.default = router;
