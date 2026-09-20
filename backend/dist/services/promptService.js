"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptService = exports.PromptService = void 0;
const mockPrompts_1 = require("../data/mockPrompts");
class PromptService {
    prompts = [...mockPrompts_1.mockPrompts];
    getAllPrompts(merchantId) {
        if (merchantId) {
            return this.prompts.filter(p => p.merchantId === merchantId);
        }
        return this.prompts;
    }
    getPromptById(id) {
        return this.prompts.find(p => p.id === id);
    }
    savePrompt(promptData) {
        const existingIndex = this.prompts.findIndex(p => p.id === promptData.id);
        // Extract variables used e.g. {{variable_name}}
        const content = promptData.content || '';
        const extractedVariables = Array.from(new Set((content.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || []).map(v => v.replace(/[\{\}]/g, ''))));
        const hygieneWarnings = this.validatePromptHygiene(content, extractedVariables);
        if (existingIndex >= 0) {
            const updated = {
                ...this.prompts[existingIndex],
                ...promptData,
                variables: extractedVariables,
                hygieneWarnings,
                updatedAt: new Date().toISOString()
            };
            this.prompts[existingIndex] = updated;
            return updated;
        }
        else {
            const newPrompt = {
                id: promptData.id || `prompt_${Date.now()}`,
                merchantId: promptData.merchantId || 'merchant_001',
                title: promptData.title || 'New Prompt Template',
                category: promptData.category || 'PRODUCT_DISCOVERY',
                content,
                version: promptData.version || 'v1.0',
                active: promptData.active ?? true,
                variables: extractedVariables,
                hygieneWarnings,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.prompts.push(newPrompt);
            return newPrompt;
        }
    }
    /**
     * Performs automated prompt hygiene checks
     */
    validatePromptHygiene(content, variables) {
        const warnings = [];
        const lower = content.toLowerCase();
        // Check for contradictory instructions
        const hasShortRule = lower.includes('short') || lower.includes('concise') || lower.includes('maximum response');
        const hasDetailedRule = lower.includes('explain every detail') || lower.includes('elaborate fully') || lower.includes('in-depth explanation');
        if (hasShortRule && hasDetailedRule) {
            warnings.push({
                type: 'CONTRADICTION',
                message: 'Prompt contains conflicting instructions: "Keep answers short" and "Explain every detail."',
                suggestion: 'Keep responses concise and provide only information relevant to the customer\'s request.'
            });
        }
        // Check missing hallucination prevention
        if (!lower.includes('never invent') && !lower.includes('hallucinat') && !lower.includes('do not assume')) {
            warnings.push({
                type: 'MISSING_FALLBACK',
                message: 'Prompt lacks explicit hallucination restriction rule.',
                suggestion: 'Add instruction: "Never invent prices, stock levels, or product specifications not present in verified context."'
            });
        }
        // Check for missing core variable tags
        if (!variables.includes('customer_message') && content.length > 50) {
            warnings.push({
                type: 'MISSING_VARIABLE',
                message: 'Missing {{customer_message}} placeholder.',
                suggestion: 'Include {{customer_message}} tag so customer input is injected into system prompt.'
            });
        }
        // Check excessive length for voice prompt
        if (content.length > 2500) {
            warnings.push({
                type: 'EXCESSIVE_LENGTH',
                message: 'Prompt length exceeds 2500 characters which increases system latency for voice calls.',
                suggestion: 'Trim system instructions down to core operational rules.'
            });
        }
        return warnings;
    }
    /**
     * Substitutes template variables with actual merchant & customer runtime data
     */
    renderPrompt(promptTemplate, merchant, productContext, customerMessage) {
        let rendered = promptTemplate;
        const replacements = {
            merchant_name: merchant.name,
            language: merchant.language,
            tone: merchant.tone,
            max_response_words: merchant.maxResponseWords.toString(),
            currency: merchant.currency,
            business_rules: merchant.businessRules.map(r => `- ${r}`).join('\n'),
            product_context: productContext,
            customer_message: customerMessage
        };
        for (const [key, val] of Object.entries(replacements)) {
            const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
            rendered = rendered.replace(regex, val);
        }
        return rendered;
    }
}
exports.PromptService = PromptService;
exports.promptService = new PromptService();
