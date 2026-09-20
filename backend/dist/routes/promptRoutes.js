"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promptService_1 = require("../services/promptService");
const geminiService_1 = require("../services/geminiService");
const mockMerchants_1 = require("../data/mockMerchants");
const productService_1 = require("../services/productService");
const productNormalizer_1 = require("../services/productNormalizer");
const router = (0, express_1.Router)();
// GET /api/prompts
router.get('/', (req, res) => {
    const merchantId = req.query.merchantId;
    const prompts = promptService_1.promptService.getAllPrompts(merchantId);
    res.json({ success: true, count: prompts.length, data: prompts });
});
// GET /api/prompts/:id
router.get('/:id', (req, res) => {
    const prompt = promptService_1.promptService.getPromptById(req.params.id);
    if (!prompt) {
        return res.status(404).json({ success: false, error: 'Prompt template not found' });
    }
    res.json({ success: true, data: prompt });
});
// POST /api/prompts
router.post('/', (req, res) => {
    const prompt = promptService_1.promptService.savePrompt(req.body);
    res.status(201).json({ success: true, data: prompt });
});
// PUT /api/prompts/:id
router.put('/:id', (req, res) => {
    const prompt = promptService_1.promptService.savePrompt({ ...req.body, id: req.params.id });
    res.json({ success: true, data: prompt });
});
// POST /api/prompts/:id/test
router.post('/:id/test', async (req, res) => {
    const prompt = promptService_1.promptService.getPromptById(req.params.id);
    if (!prompt) {
        return res.status(404).json({ success: false, error: 'Prompt not found' });
    }
    const { message, merchantId } = req.body;
    const merchant = mockMerchants_1.mockMerchants.find(m => m.id === (merchantId || prompt.merchantId)) || mockMerchants_1.mockMerchants[0];
    const products = await productService_1.productService.getProducts();
    const productContext = productNormalizer_1.productNormalizer.normalizeForLLM(products);
    const renderedSystemPrompt = promptService_1.promptService.renderPrompt(prompt.content, merchant, productContext, message || 'Bhai black shoes size 9 mein hain kya?');
    const result = await geminiService_1.geminiService.generateAgentResponse(renderedSystemPrompt, merchant, message || 'Bhai black shoes size 9 mein hain kya?');
    res.json({
        success: true,
        promptVersion: prompt.version,
        renderedPrompt: renderedSystemPrompt,
        agentResponse: result.responseText,
        toolsCalled: result.toolsCalled,
        toolResults: result.toolResults,
        latencyMs: result.latencyMs
    });
});
exports.default = router;
