import { Router, Request, Response } from 'express';
import { mockMerchants } from '../data/mockMerchants';
import { Merchant } from '../types';

const router = Router();
let merchants: Merchant[] = [...mockMerchants];

// GET /api/merchants
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, count: merchants.length, data: merchants });
});

// GET /api/merchants/:id
router.get('/:id', (req: Request, res: Response) => {
  const merchant = merchants.find(m => m.id === req.params.id);
  if (!merchant) {
    return res.status(404).json({ success: false, error: 'Merchant not found' });
  }
  res.json({ success: true, data: merchant });
});

// POST /api/merchants
router.post('/', (req: Request, res: Response) => {
  const body = req.body;
  const newMerchant: Merchant = {
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
router.put('/:id', (req: Request, res: Response) => {
  const index = merchants.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Merchant not found' });
  }

  const updated: Merchant = {
    ...merchants[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  merchants[index] = updated;
  res.json({ success: true, data: updated });
});

export default router;
