import { EvaluationTestCase, EvaluationResult, Merchant } from '../types';
import { mockEvaluationTestCases, mockRecentEvalResults } from '../data/mockEvals';
import { geminiService } from './geminiService';
import { promptService } from './promptService';
import { ttsPreprocessor } from './voice/ttsPreprocessor';
import { languageDetector } from './languageDetector';

export class EvalService {
  private testCases: EvaluationTestCase[] = [...mockEvaluationTestCases];
  private results: EvaluationResult[] = [...mockRecentEvalResults];

  public getTestCases(merchantId?: string): EvaluationTestCase[] {
    if (merchantId) {
      return this.testCases.filter(t => t.merchantId === merchantId);
    }
    return this.testCases;
  }

  public getResults(merchantId?: string): EvaluationResult[] {
    if (merchantId) {
      return this.results.filter(r => r.merchantId === merchantId);
    }
    return this.results;
  }

  /**
   * Run evaluation benchmark suite for a given merchant and prompt
   */
  public async runEvaluations(merchant: Merchant, promptId?: string): Promise<EvaluationResult[]> {
    const prompt = promptService.getPromptById(promptId || merchant.activePromptId) || promptService.getAllPrompts()[0];
    const newResults: EvaluationResult[] = [];

    for (const testCase of this.testCases) {
      const startTime = Date.now();

      // Render system prompt with test input
      const systemPrompt = promptService.renderPrompt(prompt.content, merchant, '', testCase.input);

      // Call Gemini Service
      const { responseText } = await geminiService.generateAgentResponse(systemPrompt, merchant, testCase.input);

      // Preprocess response for voice
      const voiceOptimized = ttsPreprocessor.preprocess(responseText, merchant.maxResponseWords);
      const latencyMs = Date.now() - startTime;

      // Judge test result against criteria
      let passed = true;
      let score = 100;
      let failureReason: string | undefined = undefined;

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
      const detectedLang = languageDetector.detectLanguage(testCase.input);
      const respLang = languageDetector.detectLanguage(voiceOptimized);
      if (detectedLang === 'hinglish' && respLang === 'english' && !testCase.input.toLowerCase().includes('english')) {
        score -= 20; // minor penalty if language styling didn't adapt
      }

      const result: EvaluationResult = {
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

export const evalService = new EvalService();
