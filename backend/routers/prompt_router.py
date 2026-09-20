from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.prompt_service import prompt_service
from services.gemini_service import gemini_service
from services.product_service import product_service
from services.product_normalizer import product_normalizer
from data.mock_merchants import mock_merchants

router = APIRouter(prefix="/api/prompts", tags=["Prompts"])

class TestPromptReq(BaseModel):
    message: Optional[str] = "Bhai black shoes size 9 mein hain kya?"
    merchantId: Optional[str] = None

@router.get("")
def get_prompts(merchantId: Optional[str] = None):
    prompts = prompt_service.get_all_prompts(merchantId)
    return {"success": True, "count": len(prompts), "data": [p.model_dump() for p in prompts]}

@router.get("/{prompt_id}")
def get_prompt_by_id(prompt_id: str):
    p = prompt_service.get_prompt_by_id(prompt_id)
    if not p:
        raise HTTPException(status_code=404, detail="Prompt template not found")
    return {"success": True, "data": p.model_dump()}

@router.post("")
def create_prompt(payload: dict):
    p = prompt_service.save_prompt(payload)
    return {"success": True, "data": p.model_dump()}

@router.put("/{prompt_id}")
def update_prompt(prompt_id: str, payload: dict):
    payload['id'] = prompt_id
    p = prompt_service.save_prompt(payload)
    return {"success": True, "data": p.model_dump()}

@router.post("/{prompt_id}/test")
async def test_prompt(prompt_id: str, req: TestPromptReq):
    p = prompt_service.get_prompt_by_id(prompt_id)
    if not p:
        raise HTTPException(status_code=404, detail="Prompt not found")

    m_id = req.merchantId or p.merchantId
    merchant = next((m for m in mock_merchants if m.id == m_id), mock_merchants[0])

    products = await product_service.get_products()
    prod_context = product_normalizer.normalize_for_llm(products)

    msg = req.message or "Bhai black shoes size 9 mein hain kya?"
    rendered_sys_prompt = prompt_service.render_prompt(p.content, merchant, prod_context, msg)

    result = await gemini_service.generate_agent_response(rendered_sys_prompt, merchant, msg)

    return {
        "success": True,
        "promptVersion": p.version,
        "renderedPrompt": rendered_sys_prompt,
        "agentResponse": result['responseText'],
        "toolsCalled": [t.model_dump() for t in result['toolsCalled']],
        "toolResults": [tr.model_dump() for tr in result['toolResults']],
        "latencyMs": result['latencyMs']
    }
