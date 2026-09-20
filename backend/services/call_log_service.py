import re
import time
from datetime import datetime
from typing import List, Optional
from schemas import CallLog, Merchant
from data.mock_call_logs import mock_call_logs
from services.language_detector import language_detector

class CallLogService:
    def __init__(self):
        self.call_logs: List[CallLog] = list(mock_call_logs)

    def get_call_logs(self, merchant_id: Optional[str] = None) -> List[CallLog]:
        if merchant_id:
            return [c for c in self.call_logs if c.merchantId == merchant_id]
        return self.call_logs

    def get_call_by_id(self, call_id: str) -> Optional[CallLog]:
        return next((c for c in self.call_logs if c.id == call_id), None)

    def log_call(
        self,
        conversation_id: str,
        merchant: Merchant,
        customer_transcript: str,
        agent_response: str,
        detected_intent: str,
        latency_ms: int,
        prompt_version: str
    ) -> CallLog:
        words = [w for w in agent_response.split() if w]
        word_count = len(words)
        detected_language = language_detector.detect_language(customer_transcript)

        status = 'successful'
        break_category = None
        break_reason = None
        prompt_fix = None

        if word_count > merchant.maxResponseWords + 8:
            status = 'break_detected'
            break_category = 'Long response'
            break_reason = f"Agent response ({word_count} words) exceeded merchant's maximum target limit ({merchant.maxResponseWords} words)."
            prompt_fix = f"Update system prompt rule: 'Maximum response length: {merchant.maxResponseWords} words. Be extremely brief.'"
        elif re.search(r'[\*\#\`\[\]]', agent_response) or re.search(r'^\s*\d+[\.\)]', agent_response, re.MULTILINE):
            status = 'break_detected'
            break_category = 'TTS formatting issue'
            break_reason = 'Agent output contained markdown or numbered lists unsuitable for voice TTS synthesis.'
            prompt_fix = 'Add strict formatting prohibition in system prompt: "Do not use markdown, bullets, or numbers."'
        elif 'in stock for $' in agent_response.lower() or 'free iphone' in agent_response.lower():
            status = 'break_detected'
            break_category = 'Hallucination'
            break_reason = 'Agent generated unverified pricing or non-catalog items.'
            prompt_fix = 'Enforce fallback instruction: "Never state prices not supplied by backend tool calls."'

        new_log = CallLog(
            id=f"call_{int(time.time()*1000)}",
            conversationId=conversation_id,
            merchantId=merchant.id,
            merchantName=merchant.name,
            customerTranscript=customer_transcript,
            agentResponse=agent_response,
            durationSeconds=max(8, round(word_count * 0.7)),
            detectedIntent=detected_intent,
            detectedLanguage=detected_language,
            latencyMs=latency_ms,
            wordCount=word_count,
            status=status,
            breakCategory=break_category,
            breakReason=break_reason,
            promptFixRecommendation=prompt_fix,
            promptVersion=prompt_version,
            timestamp=datetime.utcnow().isoformat()
        )

        self.call_logs.insert(0, new_log)
        return new_log

call_log_service = CallLogService()
