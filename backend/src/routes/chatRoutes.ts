import { Router, Request, Response } from 'express';
import { mockMerchants } from '../data/mockMerchants';
import { promptService } from '../services/promptService';
import { geminiService } from '../services/geminiService';
import { productService } from '../services/productService';
import { productNormalizer } from '../services/productNormalizer';
import { ttsPreprocessor } from '../services/voice/ttsPreprocessor';
import { languageDetector } from '../services/languageDetector';
import { flowService } from '../services/flowService';
import { callLogService } from '../services/callLogService';

const router = Router();

// POST /api/chat
router.post('/', async (req: Request, res: Response) => {
  const { merchantId = 'merchant_001', message, conversationId = `conv_${Date.now()}`, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'User message is required.' });
  }

  const startTime = Date.now();

  // 1. Fetch merchant
  const merchant = mockMerchants.find(m => m.id === merchantId) || mockMerchants[0];

  // 2. Language Detection
  const detectedLanguage = languageDetector.detectLanguage(message);

  // 3. Intent & Flow Detection
  const activeFlow = flowService.detectFlowFromIntent(message);

  // 4. Retrieve Active Prompt
  const activePrompt = promptService.getPromptById(merchant.activePromptId) || promptService.getAllPrompts()[0];

  // 5. Build Product Data Context
  const products = await productService.getProducts();
  const productContext = productNormalizer.normalizeForLLM(products);

  // 6. Hydrate System Instructions
  const systemPrompt = promptService.renderPrompt(activePrompt.content, merchant, productContext, message);

  // 7. Execute Gemini LLM Turn with Function Calling
  const geminiResult = await geminiService.generateAgentResponse(systemPrompt, merchant, message, history);

  // 8. TTS Preprocessing
  const voiceResponse = ttsPreprocessor.preprocess(geminiResult.responseText, merchant.maxResponseWords);

  const totalLatencyMs = Date.now() - startTime;

  // 9. Call Log & Break Detection
  const callLog = callLogService.logCall(
    conversationId,
    merchant,
    message,
    voiceResponse,
    activeFlow.category,
    totalLatencyMs,
    activePrompt.version
  );

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

export default router;
