"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callLogService = exports.CallLogService = void 0;
const mockCallLogs_1 = require("../data/mockCallLogs");
const languageDetector_1 = require("./languageDetector");
class CallLogService {
    callLogs = [...mockCallLogs_1.mockCallLogs];
    getCallLogs(merchantId) {
        if (merchantId) {
            return this.callLogs.filter(c => c.merchantId === merchantId);
        }
        return this.callLogs;
    }
    getCallById(id) {
        return this.callLogs.find(c => c.id === id);
    }
    /**
     * Log a new agent conversation turn and inspect for agent break patterns
     */
    logCall(conversationId, merchant, customerTranscript, agentResponse, detectedIntent, latencyMs, promptVersion) {
        const wordCount = agentResponse.split(/\s+/).filter(Boolean).length;
        const detectedLanguage = languageDetector_1.languageDetector.detectLanguage(customerTranscript);
        // Agent Break Detection Logic
        let status = 'successful';
        let breakCategory = undefined;
        let breakReason = undefined;
        let promptFixRecommendation = undefined;
        // 1. Long response check
        if (wordCount > merchant.maxResponseWords + 8) {
            status = 'break_detected';
            breakCategory = 'Long response';
            breakReason = `Agent response (${wordCount} words) exceeded merchant's maximum target limit (${merchant.maxResponseWords} words).`;
            promptFixRecommendation = `Update system prompt rule: "Maximum response length: ${merchant.maxResponseWords} words. Be extremely brief."`;
        }
        // 2. TTS Formatting issue check (markdown, bullets, headers)
        else if (/[\*\#\`\[\]]/.test(agentResponse) || /^\s*\d+[\.\)]/m.test(agentResponse)) {
            status = 'break_detected';
            breakCategory = 'TTS formatting issue';
            breakReason = 'Agent output contained markdown or numbered lists unsuitable for voice TTS synthesis.';
            promptFixRecommendation = 'Add strict formatting prohibition in system prompt: "Do not use markdown, bullets, or numbers."';
        }
        // 3. Hallucination check
        else if (agentResponse.toLowerCase().includes('in stock for $') || agentResponse.toLowerCase().includes('free iphone')) {
            status = 'break_detected';
            breakCategory = 'Hallucination';
            breakReason = 'Agent generated unverified pricing or non-catalog items.';
            promptFixRecommendation = 'Enforce fallback instruction: "Never state prices not supplied by backend tool calls."';
        }
        const newLog = {
            id: `call_${Date.now()}`,
            conversationId,
            merchantId: merchant.id,
            merchantName: merchant.name,
            customerTranscript,
            agentResponse,
            durationSeconds: Math.max(8, Math.round(wordCount * 0.7)),
            detectedIntent,
            detectedLanguage,
            latencyMs,
            wordCount,
            status,
            breakCategory,
            breakReason,
            promptFixRecommendation,
            promptVersion,
            timestamp: new Date().toISOString()
        };
        this.callLogs.unshift(newLog);
        return newLog;
    }
}
exports.CallLogService = CallLogService;
exports.callLogService = new CallLogService();
