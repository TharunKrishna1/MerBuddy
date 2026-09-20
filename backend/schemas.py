from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class Merchant(BaseModel):
    id: str
    name: str
    language: Literal['english', 'hindi', 'hinglish'] = 'hinglish'
    currency: str = 'INR'
    tone: Literal['friendly', 'professional', 'energetic', 'concise'] = 'friendly'
    maxResponseWords: int = 22
    allowDiscountDiscussion: bool = True
    allowProductRecommendations: bool = True
    voiceStyle: str = 'warm-conversational'
    businessRules: List[str] = []
    activePromptId: str = 'prompt_001'
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updatedAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ProductVariant(BaseModel):
    id: str
    title: str
    price: float
    compareAtPrice: Optional[float] = None
    sku: str
    inventoryQuantity: int
    size: Optional[str] = None
    color: Optional[str] = None
    available: bool = True

class Product(BaseModel):
    id: str
    title: str
    description: str
    category: str
    tags: List[str] = []
    vendor: str
    variants: List[ProductVariant]
    image: str
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class DiscountRule(BaseModel):
    id: str
    merchantId: str
    code: str
    type: Literal['percentage', 'fixed']
    value: float
    minOrderValue: Optional[float] = None
    active: bool = True

class HygieneWarning(BaseModel):
    type: Literal['CONTRADICTION', 'MISSING_VARIABLE', 'UNSUPPORTED_VARIABLE', 'EXCESSIVE_LENGTH', 'MISSING_FALLBACK', 'VOICE_FORMATTING']
    message: str
    suggestion: str

class PromptTemplate(BaseModel):
    id: str
    merchantId: str
    title: str
    category: Literal['PRODUCT_DISCOVERY', 'PRODUCT_RECOMMENDATION', 'PRICE_QUERY', 'DISCOUNT_QUERY', 'ORDER_STATUS', 'RETURN_QUERY', 'OUT_OF_STOCK', 'GENERAL_SUPPORT']
    content: str
    version: str
    active: bool = True
    variables: List[str] = []
    hygieneWarnings: List[HygieneWarning] = []
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updatedAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class FlowStep(BaseModel):
    id: str
    label: str
    action: str
    description: str

class ConversationFlow(BaseModel):
    id: str
    flowId: str
    name: str
    category: str
    description: str
    steps: List[FlowStep]
    isActive: bool = True

class ToolCall(BaseModel):
    id: str
    name: str
    args: Dict[str, Any]

class ToolResult(BaseModel):
    toolCallId: str
    name: str
    result: Any

class ChatMessage(BaseModel):
    id: str
    role: Literal['user', 'assistant', 'system', 'tool']
    content: str
    timestamp: str
    toolCalls: Optional[List[ToolCall]] = None
    toolResults: Optional[List[ToolResult]] = None

class ChatRequest(BaseModel):
    merchantId: str = 'merchant_001'
    message: str
    conversationId: Optional[str] = None
    history: List[Dict[str, Any]] = []

class EvaluationTestCase(BaseModel):
    id: str
    merchantId: str
    name: str
    category: str
    input: str
    expectedBehavior: str

class EvaluationResult(BaseModel):
    id: str
    testId: str
    testName: str
    category: str
    merchantId: str
    promptId: str
    input: str
    expectedBehavior: str
    actualResponse: str
    passed: bool
    score: float
    failureReason: Optional[str] = None
    latencyMs: int
    timestamp: str

class CallLog(BaseModel):
    id: str
    conversationId: str
    merchantId: str
    merchantName: str
    customerTranscript: str
    agentResponse: str
    durationSeconds: int
    detectedIntent: str
    detectedLanguage: Literal['english', 'hindi', 'hinglish']
    latencyMs: int
    wordCount: int
    status: Literal['successful', 'break_detected']
    breakCategory: Optional[str] = None
    breakReason: Optional[str] = None
    promptFixRecommendation: Optional[str] = None
    promptVersion: str
    timestamp: str

class PriceCalculationResult(BaseModel):
    originalPrice: float
    discountPercentage: float
    discountAmount: float
    finalPrice: float
    currency: str
    appliedDiscountCode: Optional[str] = None
    formattedOriginalPrice: str
    formattedFinalPrice: str
    speechFormattedPrice: str
    isValid: bool
    errorMessage: Optional[str] = None
