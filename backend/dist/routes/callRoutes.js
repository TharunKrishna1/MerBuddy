"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const callLogService_1 = require("../services/callLogService");
const router = (0, express_1.Router)();
// GET /api/calls
router.get('/', (req, res) => {
    const merchantId = req.query.merchantId;
    const calls = callLogService_1.callLogService.getCallLogs(merchantId);
    res.json({ success: true, count: calls.length, data: calls });
});
// GET /api/calls/:id
router.get('/:id', (req, res) => {
    const call = callLogService_1.callLogService.getCallById(req.params.id);
    if (!call) {
        return res.status(404).json({ success: false, error: 'Call log entry not found' });
    }
    res.json({ success: true, data: call });
});
exports.default = router;
