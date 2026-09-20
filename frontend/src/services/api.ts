import {
  Merchant,
  Product,
  PromptTemplate,
  ChatResponsePayload,
  EvaluationResult,
  CallLog,
  AnalyticsSummary
} from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || json.message || 'API request failed');
  }
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Merchants
  async getMerchants(): Promise<Merchant[]> {
    const res = await fetch(`${API_BASE}/merchants`);
    return handleResponse<Merchant[]>(res);
  },

  async updateMerchant(id: string, data: Partial<Merchant>): Promise<Merchant> {
    const res = await fetch(`${API_BASE}/merchants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Merchant>(res);
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    return handleResponse<Product[]>(res);
  },

  async searchProducts(query: string, category?: string, color?: string, size?: string): Promise<Product[]> {
    const params = new URLSearchParams({ q: query });
    if (category) params.append('category', category);
    if (color) params.append('color', color);
    if (size) params.append('size', size);
    const res = await fetch(`${API_BASE}/products/search?${params.toString()}`);
    return handleResponse<Product[]>(res);
  },

  // Pricing & Discounts
  async calculatePrice(originalPrice: number, discountPercentage?: number) {
    const res = await fetch(`${API_BASE}/pricing/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalPrice, discountPercentage })
    });
    return handleResponse<any>(res);
  },

  async applyDiscount(merchantId: string, couponCode: string, orderValue: number) {
    const res = await fetch(`${API_BASE}/discounts/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchantId, couponCode, orderValue })
    });
    return handleResponse<any>(res);
  },

  // Prompts
  async getPrompts(merchantId?: string): Promise<PromptTemplate[]> {
    const url = merchantId ? `${API_BASE}/prompts?merchantId=${merchantId}` : `${API_BASE}/prompts`;
    const res = await fetch(url);
    return handleResponse<PromptTemplate[]>(res);
  },

  async savePrompt(promptData: Partial<PromptTemplate>): Promise<PromptTemplate> {
    const method = promptData.id ? 'PUT' : 'POST';
    const url = promptData.id ? `${API_BASE}/prompts/${promptData.id}` : `${API_BASE}/prompts`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promptData)
    });
    return handleResponse<PromptTemplate>(res);
  },

  async testPrompt(id: string, message: string, merchantId?: string) {
    const res = await fetch(`${API_BASE}/prompts/${id}/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, merchantId })
    });
    return res.json();
  },

  // Chat & Voice
  async sendChat(merchantId: string, message: string, conversationId?: string, history: any[] = []): Promise<ChatResponsePayload> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchantId, message, conversationId, history })
    });
    return res.json();
  },

  async synthesizeSpeech(text: string, voiceStyle?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/voice/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceStyle })
    });
    return res.json();
  },

  // Evals
  async getEvaluations(merchantId?: string): Promise<EvaluationResult[]> {
    const url = merchantId ? `${API_BASE}/evaluations?merchantId=${merchantId}` : `${API_BASE}/evaluations`;
    const res = await fetch(url);
    return handleResponse<EvaluationResult[]>(res);
  },

  async runEvaluations(merchantId: string, promptId?: string) {
    const res = await fetch(`${API_BASE}/evaluations/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchantId, promptId })
    });
    return res.json();
  },

  // Call Logs
  async getCallLogs(merchantId?: string): Promise<CallLog[]> {
    const url = merchantId ? `${API_BASE}/calls?merchantId=${merchantId}` : `${API_BASE}/calls`;
    const res = await fetch(url);
    return handleResponse<CallLog[]>(res);
  },

  // Analytics
  async getAnalytics(merchantId?: string): Promise<AnalyticsSummary> {
    const url = merchantId ? `${API_BASE}/analytics?merchantId=${merchantId}` : `${API_BASE}/analytics`;
    const res = await fetch(url);
    return handleResponse<AnalyticsSummary>(res);
  }
};
