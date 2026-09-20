import re
from datetime import datetime
from typing import List, Optional, Dict, Any
from schemas import PromptTemplate, HygieneWarning, Merchant
from data.mock_prompts import mock_prompts

class PromptService:
    def __init__(self):
        self.prompts: List[PromptTemplate] = list(mock_prompts)

    def get_all_prompts(self, merchant_id: Optional[str] = None) -> List[PromptTemplate]:
        if merchant_id:
            return [p for p in self.prompts if p.merchantId == merchant_id]
        return self.prompts

    def get_prompt_by_id(self, prompt_id: str) -> Optional[PromptTemplate]:
        return next((p for p in self.prompts if p.id == prompt_id), None)

    def validate_prompt_hygiene(self, content: str, variables: List[str]) -> List[HygieneWarning]:
        warnings = []
        lower = content.lower()

        # Check contradictions
        has_short = 'short' in lower or 'concise' in lower or 'maximum response' in lower
        has_detail = 'explain every detail' in lower or 'elaborate fully' in lower or 'in-depth' in lower
        if has_short and has_detail:
            warnings.append(HygieneWarning(
                type='CONTRADICTION',
                message='Prompt contains conflicting instructions: "Keep answers short" and "Explain every detail."',
                suggestion="Keep responses concise and provide only information relevant to the customer's request."
            ))

        # Check hallucination fallback
        if 'never invent' not in lower and 'hallucinat' not in lower and 'do not assume' not in lower:
            warnings.append(HygieneWarning(
                type='MISSING_FALLBACK',
                message='Prompt lacks explicit hallucination restriction rule.',
                suggestion='Add instruction: "Never invent prices, stock levels, or product specifications not present in verified context."'
            ))

        # Check customer message tag
        if 'customer_message' not in variables and len(content) > 50:
            warnings.append(HygieneWarning(
                type='MISSING_VARIABLE',
                message='Missing {{customer_message}} placeholder.',
                suggestion='Include {{customer_message}} tag so customer input is injected into system prompt.'
            ))

        # Check excessive length
        if len(content) > 2500:
            warnings.append(HygieneWarning(
                type='EXCESSIVE_LENGTH',
                message='Prompt length exceeds 2500 characters which increases system latency for voice calls.',
                suggestion='Trim system instructions down to core operational rules.'
            ))

        return warnings

    def save_prompt(self, prompt_data: Dict[str, Any]) -> PromptTemplate:
        content = prompt_data.get('content', '')
        extracted_vars = list(set(re.findall(r'\{\{\s*([a-zA-Z0-9_]+)\s*\}\}', content)))
        warnings = self.validate_prompt_hygiene(content, extracted_vars)

        prompt_id = prompt_data.get('id')
        existing_idx = next((i for i, p in enumerate(self.prompts) if p.id == prompt_id), -1)

        if existing_idx >= 0:
            existing = self.prompts[existing_idx]
            updated = PromptTemplate(
                id=existing.id,
                merchantId=prompt_data.get('merchantId', existing.merchantId),
                title=prompt_data.get('title', existing.title),
                category=prompt_data.get('category', existing.category),
                content=content,
                version=prompt_data.get('version', existing.version),
                active=prompt_data.get('active', existing.active),
                variables=extracted_vars,
                hygieneWarnings=warnings,
                createdAt=existing.createdAt,
                updatedAt=datetime.utcnow().isoformat()
            )
            self.prompts[existing_idx] = updated
            return updated
        else:
            new_prompt = PromptTemplate(
                id=prompt_id or f"prompt_{int(datetime.utcnow().timestamp())}",
                merchantId=prompt_data.get('merchantId', 'merchant_001'),
                title=prompt_data.get('title', 'New Prompt Template'),
                category=prompt_data.get('category', 'PRODUCT_DISCOVERY'),
                content=content,
                version=prompt_data.get('version', 'v1.0'),
                active=prompt_data.get('active', True),
                variables=extracted_vars,
                hygieneWarnings=warnings,
                createdAt=datetime.utcnow().isoformat(),
                updatedAt=datetime.utcnow().isoformat()
            )
            self.prompts.append(new_prompt)
            return new_prompt

    def render_prompt(self, template: str, merchant: Merchant, product_context: str, customer_message: str) -> str:
        rendered = template
        replacements = {
            'merchant_name': merchant.name,
            'language': merchant.language,
            'tone': merchant.tone,
            'max_response_words': str(merchant.maxResponseWords),
            'currency': merchant.currency,
            'business_rules': '\n'.join([f"- {r}" for r in merchant.businessRules]),
            'product_context': product_context,
            'customer_message': customer_message
        }

        for k, v in replacements.items():
            rendered = re.sub(r'\{\{\s*' + k + r'\s*\}\}', v, rendered)

        return rendered

prompt_service = PromptService()
