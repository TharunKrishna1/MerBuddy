import { Merchant } from '../types';

export const mockMerchants: Merchant[] = [
  {
    id: 'merchant_001',
    name: 'UrbanKicks',
    language: 'hinglish',
    currency: 'INR',
    tone: 'friendly',
    maxResponseWords: 22,
    allowDiscountDiscussion: true,
    allowProductRecommendations: true,
    voiceStyle: 'warm-conversational',
    businessRules: [
      'Always confirm footwear size and color before suggesting a purchase.',
      'Never offer discounts higher than 25% without explicit coupon code.',
      'Express prices naturally in Indian Rupees (₹).'
    ],
    activePromptId: 'prompt_001',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-09-15T14:30:00Z'
  },
  {
    id: 'merchant_002',
    name: 'ApexAthletics',
    language: 'english',
    currency: 'INR',
    tone: 'energetic',
    maxResponseWords: 20,
    allowDiscountDiscussion: true,
    allowProductRecommendations: true,
    voiceStyle: 'active-sporty',
    businessRules: [
      'Highlight premium cushioning and performance features.',
      'Suggest matching performance socks on orders over ₹3000.'
    ],
    activePromptId: 'prompt_002',
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-09-10T11:20:00Z'
  },
  {
    id: 'merchant_003',
    name: 'HeritageEthnic',
    language: 'hindi',
    currency: 'INR',
    tone: 'professional',
    maxResponseWords: 25,
    allowDiscountDiscussion: false,
    allowProductRecommendations: true,
    voiceStyle: 'polite-formal',
    businessRules: [
      'Greet customers politely with Namaste.',
      'Emphasize hand-woven fabric quality and wash care instructions.'
    ],
    activePromptId: 'prompt_003',
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-09-18T16:00:00Z'
  }
];
