"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalService = exports.EvalService = void 0;
const mockEvals_1 = require("../data/mockEvals");
const geminiService_1 = require("./geminiService");
const promptService_1 = require("./promptService");
const ttsPreprocessor_1 = require("./voice/ttsPreprocessor");
const languageDetector_1 = require("./languageDetector");
class EvalService {
    testCases = [...mockEvals_1.mockEvaluationTestCases];
    results = [...mockEvals_1.mockRecentEvalResults];
    getTestCases(merchantId) {
        if (merchantId) {
            return this.testCases.filter(t => t.merchantId === merchantId);
        }
        return this.testCases;
    }
    getResults(merchantId) {
        if (merchantId) {
            return this.results.filter(r => r.merchantId === merchantId);
        }
        return this.results;
    }
    /**
     * Run evaluation benchmark suite for a given merchant and prompt
     */
    async runEvaluations(merchant, promptId) {
        const prompt = promptService_1.promptService.getPromptById(promptId || merchant.activePromptId) || promptService_1.promptService.getAllPrompts()[0];
        const newResults = [];
        for (const testCase of this.testCases) {
            const startTime = Date.now();
            // Render system prompt with test input
            const systemPrompt = promptService_1.promptService.renderPrompt(prompt.content, merchant, '', testCase.input);
            // Call Gemini Service
            const { responseText } = await geminiService_1.geminiService.generateAgentResponse(systemPrompt, merchant, testCase.input);
            // Preprocess response for voice
            const voiceOptimized = ttsPreprocessor_1.ttsPreprocessor.preprocess(responseText, merchant.maxResponseWords);
            const latencyMs = Date.now() - startTime;
            // Judge test result against criteria
            let passed = true;
            let score = 100;
            let failureReason = undefined;
            const wordCount = voiceOptimized.split(/\s+/).length;
            // Criterion 1: Word Count constraint check
            if (wordCount > merchant.maxResponseWords + 5) {
                passed = false;
                score -= 40;
                failureReason = `Response length (${wordCount} words) exceeded max allowed limit of ${merchant.maxResponseWords} words.`;
            }
            // Criterion 2: Hallucination check for unknown product
            if (testCase.category === 'Safety' && (voiceOptimized.toLowerCase().includes('titanium') || voiceOptimized.toLowerCase().includes('iphone'))) {
                passed = false;
                score = 0;
                failureReason = 'Agent hallucinated product details for item outside catalog.';
            }
            // Criterion 3: Language Check
            const detectedLang = languageDetector_1.languageDetector.detectLanguage(testCase.input);
            const respLang = languageDetector_1.languageDetector.detectLanguage(voiceOptimized);
            if (detectedLang === 'hinglish' && respLang === 'english' && !testCase.input.toLowerCase().includes('english')) {
                score -= 20; // minor penalty if language styling didn't adapt
            }
            const result = {
                id: `eval_res_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                testId: testCase.id,
                testName: testCase.name,
                category: testCase.category,
                merchantId: merchant.id,
                promptId: prompt.id,
                input: testCase.input,
                expectedBehavior: testCase.expectedBehavior,
                actualResponse: voiceOptimized,
                passed,
                score: Math.max(0, score),
                failureReason,
                latencyMs,
                timestamp: new Date().toISOString()
            };
            testCase.lastRunResult = result;
            newResults.push(result);
            this.results.unshift(result);
        }
        return newResults;
    }
}
exports.EvalService = EvalService;
exports.evalService = new EvalService();
