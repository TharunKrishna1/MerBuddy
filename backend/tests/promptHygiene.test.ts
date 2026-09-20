import { describe, it, expect } from 'vitest';
import { promptService } from '../src/services/promptService';

describe('Prompt Hygiene System Unit Tests', () => {
  it('detects contradictory instructions', () => {
    const promptText = 'Keep answers short and concise. Make sure to explain every detail in depth.';
    const warnings = promptService.validatePromptHygiene(promptText, ['customer_message']);
    const hasContradiction = warnings.some(w => w.type === 'CONTRADICTION');
    expect(hasContradiction).toBe(true);
  });

  it('flags missing hallucination restriction', () => {
    const promptText = 'Respond nicely to customer: {{customer_message}}';
    const warnings = promptService.validatePromptHygiene(promptText, ['customer_message']);
    const hasMissingFallback = warnings.some(w => w.type === 'MISSING_FALLBACK');
    expect(hasMissingFallback).toBe(true);
  });

  it('substitutes merchant variables correctly', () => {
    const template = 'Welcome to {{merchant_name}}! Language: {{language}}. Message: {{customer_message}}';
    const merchant = {
      id: 'm1', name: 'UrbanKicks', language: 'hinglish' as const, currency: 'INR', tone: 'friendly' as const,
      maxResponseWords: 20, allowDiscountDiscussion: true, allowProductRecommendations: true, voiceStyle: 'friendly',
      businessRules: ['No refunds on clearance.'], activePromptId: 'p1', createdAt: '', updatedAt: ''
    };
    const rendered = promptService.renderPrompt(template, merchant, '', 'Hello!');
    expect(rendered).toContain('Welcome to UrbanKicks!');
    expect(rendered).toContain('Language: hinglish.');
    expect(rendered).toContain('Message: Hello!');
  });
});
