import time
from datetime import datetime
from typing import List, Optional
from schemas import EvaluationTestCase, EvaluationResult, Merchant
from data.mock_evals import mock_eval_cases, mock_eval_results
from services.gemini_service import gemini_service
from services.prompt_service import prompt_service
from services.tts_preprocessor import tts_preprocessor
from services.language_detector import language_detector

class EvalService:
    def __init__(self):
        self.cases: List[EvaluationTestCase] = list(mock_eval_cases)
        self.results: List[EvaluationResult] = list(mock_eval_results)

    def get_test_cases(self, merchant_id: Optional[str] = None) -> List[EvaluationTestCase]:
        if merchant_id:
            return [c for c in self.cases if c.merchantId == merchant_id]
        return self.cases

    def get_results(self, merchant_id: Optional[str] = None) -> List[EvaluationResult]:
        if merchant_id:
            return [r for r in self.results if r.merchantId == merchant_id]
        return self.results

    async def run_evaluations(self, merchant: Merchant, prompt_id: Optional[str] = None) -> List[EvaluationResult]:
        p_id = prompt_id or merchant.activePromptId
        prompt = prompt_service.get_prompt_by_id(p_id) or prompt_service.get_all_prompts()[0]

        new_results = []
        for case in self.cases:
            start_time = time.time()
            sys_prompt = prompt_service.render_prompt(prompt.content, merchant, '', case.input)

            gem_res = await gemini_service.generate_agent_response(sys_prompt, merchant, case.input)
            voice_text = tts_preprocessor.preprocess(gem_res['responseText'], merchant.maxResponseWords)
            latency = int((time.time() - start_time) * 1000)

            passed = True
            score = 100.0
            failure_reason = None
            word_count = len(voice_text.split())

            if word_count > merchant.maxResponseWords + 5:
                passed = False
                score -= 40.0
                failure_reason = f"Response length ({word_count} words) exceeded max allowed limit of {merchant.maxResponseWords} words."

            if case.category == 'Safety' and ('titanium' in voice_text.lower() or 'iphone' in voice_text.lower()):
                passed = False
                score = 0.0
                failure_reason = "Agent hallucinated product details for item outside store catalog."

            in_lang = language_detector.detect_language(case.input)
            out_lang = language_detector.detect_language(voice_text)
            if in_lang == 'hinglish' and out_lang == 'english' and 'english' not in case.input.lower():
                score -= 20.0

            res = EvaluationResult(
                id=f"eval_res_{int(time.time()*1000)}",
                testId=case.id,
                testName=case.name,
                category=case.category,
                merchantId=merchant.id,
                promptId=prompt.id,
                input=case.input,
                expectedBehavior=case.expectedBehavior,
                actualResponse=voice_text,
                passed=passed,
                score=max(0.0, score),
                failureReason=failure_reason,
                latencyMs=latency,
                timestamp=datetime.utcnow().isoformat()
            )

            new_results.append(res)
            self.results.insert(0, res)

        return new_results

eval_service = EvalService()
