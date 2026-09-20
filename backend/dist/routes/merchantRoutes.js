"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mockMerchants_1 = require("../data/mockMerchants");
const router = (0, express_1.Router)();
let merchants = [...mockMerchants_1.mockMerchants];
// GET /api/merchants
router.get('/', (req, res) => {
    res.json({ success: true, count: merchants.length, data: merchants });
});
// GET /api/merchants/:id
router.get('/:id', (req, res) => {
    const merchant = merchants.find(m => m.id === req.params.id);
    if (!merchant) {
        return res.status(404).json({ success: false, error: 'Merchant not found' });
    }
    res.json({ success: true, data: merchant });
});
// POST /api/merchants
router.post('/', (req, res) => {
    const body = req.body;
    const newMerchant = {
        id: body.id || `merchant_${Date.now()}`,
        name: body.name || 'New Merchant Store',
        language: body.language || 'hinglish',
        currency: body.currency || 'INR',
        tone: body.tone || 'friendly',
        maxResponseWords: body.maxResponseWords || 22,
        allowDiscountDiscussion: body.allowDiscountDiscussion ?? true,
        allowProductRecommendations: body.allowProductRecommendations ?? true,
        voiceStyle: body.voiceStyle || 'friendly',
        businessRules: body.businessRules || [],
        activePromptId: body.activePromptId || 'prompt_001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    merchants.push(newMerchant);
    res.status(201).json({ success: true, data: newMerchant });
});
// PUT /api/merchants/:id
router.put('/:id', (req, res) => {
    const index = merchants.findIndex(m => m.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, error: 'Merchant not found' });
    }
    const updated = {
        ...merchants[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    merchants[index] = updated;
    res.json({ success: true, data: updated });
});
exports.default = router;
