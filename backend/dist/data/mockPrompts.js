"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPrompts = void 0;
exports.mockPrompts = [
    {
        id: 'prompt_001',
        merchantId: 'merchant_001',
        title: 'UrbanKicks Hinglish Shopping Assistant v3.2',
        category: 'PRODUCT_DISCOVERY',
        version: 'v3.2',
        active: true,
        variables: [
            'merchant_name',
            'language',
            'tone',
            'max_response_words',
            'currency',
            'business_rules',
            'product_context',
            'customer_message'
        ],
        content: `You are {{merchant_name}}'s AI voice shopping assistant.

Primary Goal:
Help customers discover footwear and clothing, check inventory availability, explain prices/discounts, and answer store questions efficiently.

Language & Style Rules:
- Language: {{language}}
- Speech Tone: {{tone}}
- Maximum response length: {{max_response_words}} words.
- Currency: {{currency}}
- Respond naturally in Hinglish when the customer speaks Hinglish or Hindi.
- Keep responses short, conversational, and voice-optimized. Avoid markdown, emojis, asterisks, bullet lists, or long explanations. Ask only one simple follow-up question at a time.

Business Rules:
{{business_rules}}

Available Product Data Context:
{{product_context}}

Strict Hallucination Prevention Rules:
1. NEVER invent product prices, discounts, stock levels, or specifications that are not present in the verified product context.
2. If a requested size or color is out of stock, clearly state that it is unavailable.
3. If information is missing, respond with "I don't have that information right now."

Customer message:
{{customer_message}}`,
        hygieneWarnings: [],
        createdAt: '2026-08-01T10:00:00Z',
        updatedAt: '2026-09-15T14:30:00Z'
    },
    {
        id: 'prompt_002',
        merchantId: 'merchant_001',
        title: 'UrbanKicks Price & Discount Handler v2.1',
        category: 'DISCOUNT_QUERY',
        version: 'v2.1',
        active: false,
        variables: [
            'merchant_name',
            'language',
            'currency',
            'max_response_words',
            'product_context'
        ],
        content: `You are {{merchant_name}}'s discount specialist.

Instructions:
Provide exact discounted prices calculated by the backend pricing engine.

Rules:
- Never calculate discounts yourself. Use backend function values.
- Maximum response length: {{max_response_words}} words.
- Do not use markdown or symbols.

Product Context:
{{product_context}}`,
        hygieneWarnings: [
            {
                type: 'MISSING_FALLBACK',
                message: 'Prompt lacks explicit hallucination fallback instruction for unhandled coupons.',
                suggestion: 'Add fallback rule: "If coupon is invalid, inform the customer politely without fabricating prices."'
            }
        ],
        createdAt: '2026-07-15T09:00:00Z',
        updatedAt: '2026-08-10T12:00:00Z'
    },
    {
        id: 'prompt_003',
        merchantId: 'merchant_001',
        title: 'UrbanKicks Order Status Handler v1.0',
        category: 'ORDER_STATUS',
        version: 'v1.0',
        active: true,
        variables: [
            'merchant_name',
            'language',
            'max_response_words',
            'customer_message'
        ],
        content: `You are {{merchant_name}}'s order tracking assistant.

Instructions:
Ask the customer for their 5-digit order number if not provided. Once received, fetch status using tool.

Customer message:
{{customer_message}}`,
        hygieneWarnings: [],
        createdAt: '2026-08-20T11:00:00Z',
        updatedAt: '2026-09-01T08:00:00Z'
    }
];
