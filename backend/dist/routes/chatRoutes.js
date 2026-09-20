"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mockMerchants_1 = require("../data/mockMerchants");
const promptService_1 = require("../services/promptService");
const geminiService_1 = require("../services/geminiService");
const productService_1 = require("../services/productService");
const productNormalizer_1 = require("../services/productNormalizer");
const ttsPreprocessor_1 = require("../services/voice/ttsPreprocessor");
const languageDetector_1 = require("../services/languageDetector");
const flowService_1 = require("../services/flowService");
const callLogService_1 = require("../services/callLogService");
const router = (0, express_1.Router)();
// POST /api/chat
router.post('/', async (req, res) => {
    const { merchantId = 'merchant_001', message, conversationId = `conv_${Date.now()}`, history = [] } = req.body;
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, error: 'User message is required.' });
    }
    const startTime = Date.now();
    // 1. Fetch merchant
    const merchant = mockMerchants_1.mockMerchants.find(m => m.id === merchantId) || mockMerchants_1.mockMerchants[0];
    // 2. Language Detection
    const detectedLanguage = languageDetector_1.languageDetector.detectLanguage(message);
    // 3. Intent & Flow Detection
    const activeFlow = flowService_1.flowService.detectFlowFromIntent(message);
    // 4. Retrieve Active Prompt
    const activePrompt = promptService_1.promptService.getPromptById(merchant.activePromptId) || promptService_1.promptService.getAllPrompts()[0];
    // 5. Build Product Data Context
    const products = await productService_1.productService.getProducts();
    const productContext = productNormalizer_1.productNormalizer.normalizeForLLM(products);
    // 6. Hydrate System Instructions
    const systemPrompt = promptService_1.promptService.renderPrompt(activePrompt.content, merchant, productContext, message);
    // 7. Execute Gemini LLM Turn with Function Calling
    const geminiResult = await geminiService_1.geminiService.generateAgentResponse(systemPrompt, merchant, message, history);
    // 8. TTS Preprocessing
    const voiceResponse = ttsPreprocessor_1.ttsPreprocessor.preprocess(geminiResult.responseText, merchant.maxResponseWords);
    const totalLatencyMs = Date.now() - startTime;
    // 9. Call Log & Break Detection
    const callLog = callLogService_1.callLogService.logCall(conversationId, merchant, message, voiceResponse, activeFlow.category, totalLatencyMs, activePrompt.version);
    // 10. Return Structured API Response
    res.json({
        success: true,
        conversationId,
        detectedLanguage,
        merchantId: merchant.id,
        merchantName: merchant.name,
        intent: activeFlow.category,
        currentFlow: activeFlow,
        response: voiceResponse,
        rawLlmResponse: geminiResult.responseText,
        toolsCalled: geminiResult.toolsCalled,
        toolResults: geminiResult.toolResults,
        metadata: {
            promptVersion: activePrompt.version,
            latencyMs: totalLatencyMs,
            wordCount: voiceResponse.split(/\s+/).length,
            breakDetected: callLog.status === 'break_detected',
            breakReason: callLog.breakReason
        }
    });
});
exports.default = router;
