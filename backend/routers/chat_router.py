import time
from fastapi import APIRouter, HTTPException
from schemas import ChatRequest
from data.mock_merchants import mock_merchants
from services.prompt_service import prompt_service
from services.gemini_service import gemini_service
from services.product_service import product_service
from services.product_normalizer import product_normalizer
from services.tts_preprocessor import tts_preprocessor
from services.language_detector import language_detector
from services.flow_service import flow_service
from services.call_log_service import call_log_service

router = APIRouter(prefix="/api/chat", tags=["Chat & Voice Conversation Engine"])

@router.post("")
async def chat_turn(req: ChatRequest):
    if not req.message or not isinstance(req.message, str):
        raise HTTPException(status_code=400, detail="User message is required.")

    start_time = time.time()
    merchant = next((m for m in mock_merchants if m.id == req.merchantId), mock_merchants[0])
    conversation_id = req.conversationId or f"conv_{int(start_time*1000)}"

    # Language & Flow Detection
    detected_lang = language_detector.detect_language(req.message)
    active_flow = flow_service.detect_flow_from_intent(req.message)
    active_prompt = prompt_service.get_prompt_by_id(merchant.activePromptId) or prompt_service.get_all_prompts()[0]

    # Context & System Prompt Rendering
    products = await product_service.get_products()
    prod_context = product_normalizer.normalize_for_llm(products)
    sys_prompt = prompt_service.render_prompt(active_prompt.content, merchant, prod_context, req.message)

    # Gemini Turn with Tools
    gem_result = await gemini_service.generate_agent_response(sys_prompt, merchant, req.message, req.history)
    voice_response = tts_preprocessor.preprocess(gem_result['responseText'], merchant.maxResponseWords)
    latency = int((time.time() - start_time) * 1000)

    # Call Logging & Break Diagnostics
    call_log = call_log_service.log_call(
        conversation_id,
        merchant,
        req.message,
        voice_response,
        active_flow.category,
        latency,
        active_prompt.version
    )

    return {
        "success": True,
        "conversationId": conversation_id,
        "detectedLanguage": detected_lang,
        "merchantId": merchant.id,
        "merchantName": merchant.name,
        "intent": active_flow.category,
        "currentFlow": active_flow.model_dump(),
        "response": voice_response,
        "rawLlmResponse": gem_result['responseText'],
        "toolsCalled": [t.model_dump() for t in gem_result['toolsCalled']],
        "toolResults": [tr.model_dump() for tr in gem_result['toolResults']],
        "metadata": {
            "promptVersion": active_prompt.version,
            "latencyMs": latency,
            "wordCount": len(voice_response.split()),
            "breakDetected": call_log.status == 'break_detected',
            "breakReason": call_log.breakReason
        }
    }
