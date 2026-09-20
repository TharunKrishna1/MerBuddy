import { Router, Request, Response } from 'express';
import { promptService } from '../services/promptService';
import { geminiService } from '../services/geminiService';
import { mockMerchants } from '../data/mockMerchants';
import { productService } from '../services/productService';
import { productNormalizer } from '../services/productNormalizer';

const router = Router();

// GET /api/prompts
router.get('/', (req: Request, res: Response) => {
  const merchantId = req.query.merchantId as string;
  const prompts = promptService.getAllPrompts(merchantId);
  res.json({ success: true, count: prompts.length, data: prompts });
});

// GET /api/prompts/:id
router.get('/:id', (req: Request, res: Response) => {
  const prompt = promptService.getPromptById(req.params.id);
  if (!prompt) {
    return res.status(404).json({ success: false, error: 'Prompt template not found' });
  }
  res.json({ success: true, data: prompt });
});

// POST /api/prompts
router.post('/', (req: Request, res: Response) => {
  const prompt = promptService.savePrompt(req.body);
  res.status(201).json({ success: true, data: prompt });
});

// PUT /api/prompts/:id
router.put('/:id', (req: Request, res: Response) => {
  const prompt = promptService.savePrompt({ ...req.body, id: req.params.id });
  res.json({ success: true, data: prompt });
});

// POST /api/prompts/:id/test
router.post('/:id/test', async (req: Request, res: Response) => {
  const prompt = promptService.getPromptById(req.params.id);
  if (!prompt) {
    return res.status(404).json({ success: false, error: 'Prompt not found' });
  }

  const { message, merchantId } = req.body;
  const merchant = mockMerchants.find(m => m.id === (merchantId || prompt.merchantId)) || mockMerchants[0];

  const products = await productService.getProducts();
  const productContext = productNormalizer.normalizeForLLM(products);

  const renderedSystemPrompt = promptService.renderPrompt(prompt.content, merchant, productContext, message || 'Bhai black shoes size 9 mein hain kya?');

  const result = await geminiService.generateAgentResponse(renderedSystemPrompt, merchant, message || 'Bhai black shoes size 9 mein hain kya?');

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

export default router;
