import { EvaluationTestCase, EvaluationResult } from '../types';

export const mockEvaluationTestCases: EvaluationTestCase[] = [
  {
    id: 'eval_001',
    merchantId: 'merchant_001',
    name: 'Hinglish Footwear Availability',
    category: 'Product Availability',
    input: 'Bhai black running shoes size 9 mein hain kya?',
    expectedBehavior: 'Search product catalog, identify Velocity Pro Black Size 9 (8 in stock), respond in short Hinglish stating availability and price.'
  },
  {
    id: 'eval_002',
    merchantId: 'merchant_001',
    name: 'Price Accuracy Verification',
    category: 'Pricing',
    input: 'Velocity Pro running shoes ka price kya hai?',
    expectedBehavior: 'Return verified price ₹4,999 with compare-at price ₹5,999 without LLM price calculation hallucination.'
  },
  {
    id: 'eval_003',
    merchantId: 'merchant_001',
    name: 'Coupon FESTIVE20 Discount Check',
    category: 'Discounts',
    input: 'Mujhe FESTIVE20 coupon code apply karna hai.',
    expectedBehavior: 'Calculate 20% discount on cart value (>₹2000), return calculated discount ₹1,000 off final price ₹3,999.'
  },
  {
    id: 'eval_004',
    merchantId: 'merchant_001',
    name: 'Short Voice Response Constraint',
    category: 'TTS Optimization',
    input: 'Store ke top running shoes ke features batao.',
    expectedBehavior: 'Limit voice response to under 22 words, avoid long lists, markdown, bullets, or asterisks.'
  },
  {
    id: 'eval_005',
    merchantId: 'merchant_001',
    name: 'Hallucination Prevention - Unknown Product',
    category: 'Safety',
    input: 'Do you have iPhone 16 Pro Max in titanium?',
    expectedBehavior: 'Recognize product is not in UrbanKicks footwear/apparel store context and state: "I don\'t have that information right now."'
  },
  {
    id: 'eval_006',
    merchantId: 'merchant_001',
    name: 'Out-of-Stock Handling',
    category: 'Inventory',
    input: 'Velocity Pro Black size 10 chahiye.',
    expectedBehavior: 'Detect inventory quantity is 0 for size 10 black, state out of stock, suggest size 9 or white option.'
  },
  {
    id: 'eval_007',
    merchantId: 'merchant_001',
    name: 'Pure English Style Maintenance',
    category: 'Language Control',
    input: 'Do you offer free shipping on orders over two thousand rupees?',
    expectedBehavior: 'Respond in clean English without switching to Hinglish or Hindi.'
  },
  {
    id: 'eval_008',
    merchantId: 'merchant_001',
    name: 'Order Status Identifier Prompt',
    category: 'Conversation Flow',
    input: 'Order kab tak deliver hoga?',
    expectedBehavior: 'Ask for the 5-digit order number politely.'
  }
];

export const mockRecentEvalResults: EvaluationResult[] = [
  {
    id: 'res_001',
    testId: 'eval_001',
    testName: 'Hinglish Footwear Availability',
    category: 'Product Availability',
    merchantId: 'merchant_001',
    promptId: 'prompt_001',
    input: 'Bhai black running shoes size 9 mein hain kya?',
    expectedBehavior: 'Search products and respond in Hinglish with stock status.',
    actualResponse: 'Haan bhai, size 9 mein black Velocity Pro running shoes available hain. Price char hazar nau sau ninyanve rupaye hai.',
    passed: true,
    score: 100,
    latencyMs: 720,
    timestamp: '2026-09-20T10:15:00Z'
  },
  {
    id: 'res_002',
    testId: 'eval_002',
    testName: 'Price Accuracy Verification',
    category: 'Pricing',
    merchantId: 'merchant_001',
    promptId: 'prompt_001',
    input: 'Velocity Pro running shoes ka price kya hai?',
    expectedBehavior: 'Return verified price ₹4,999.',
    actualResponse: 'Velocity Pro ka original price char hazar nau sau ninyanve rupaye hai.',
    passed: true,
    score: 100,
    latencyMs: 650,
    timestamp: '2026-09-20T10:15:02Z'
  },
  {
    id: 'res_003',
    testId: 'eval_004',
    testName: 'Short Voice Response Constraint',
    category: 'TTS Optimization',
    merchantId: 'merchant_001',
    promptId: 'prompt_001',
    input: 'Store ke top running shoes ke features batao.',
    expectedBehavior: 'Response length < 22 words, no markdown.',
    actualResponse: 'Velocity Pro running shoes lightweight hain aur high traction mesh foam offers super comfort for daily running.',
    passed: true,
    score: 95,
    latencyMs: 810,
    timestamp: '2026-09-20T10:15:05Z'
  },
  {
    id: 'res_004',
    testId: 'eval_005',
    testName: 'Hallucination Prevention - Unknown Product',
    category: 'Safety',
    merchantId: 'merchant_001',
    promptId: 'prompt_001',
    input: 'Do you have iPhone 16 Pro Max in titanium?',
    expectedBehavior: 'State item unavailable or unhandled.',
    actualResponse: 'I don\'t have that information right now as we specialize in footwear and apparel.',
    passed: true,
    score: 100,
    latencyMs: 540,
    timestamp: '2026-09-20T10:15:08Z'
  }
];
