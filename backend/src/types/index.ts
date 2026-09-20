export interface Merchant {
  id: string;
  name: string;
  language: 'english' | 'hindi' | 'hinglish';
  currency: string;
  tone: 'friendly' | 'professional' | 'energetic' | 'concise';
  maxResponseWords: number;
  allowDiscountDiscussion: boolean;
  allowProductRecommendations: boolean;
  voiceStyle: string;
  businessRules: string[];
  activePromptId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inventoryQuantity: number;
  size?: string;
  color?: string;
  available: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  vendor: string;
  variants: ProductVariant[];
  image: string;
  createdAt: string;
}

export interface DiscountRule {
  id: string;
  merchantId: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 20 for 20% or 500 for ₹500 off
  minOrderValue?: number;
  appliesToCategory?: string;
  appliesToProductId?: string;
  active: boolean;
}

export type PromptCategory =
  | 'PRODUCT_DISCOVERY'
  | 'PRODUCT_RECOMMENDATION'
  | 'PRICE_QUERY'
  | 'DISCOUNT_QUERY'
  | 'ORDER_STATUS'
  | 'RETURN_QUERY'
  | 'OUT_OF_STOCK'
  | 'GENERAL_SUPPORT';

export interface HygieneWarning {
  type: 'CONTRADICTION' | 'MISSING_VARIABLE' | 'UNSUPPORTED_VARIABLE' | 'EXCESSIVE_LENGTH' | 'MISSING_FALLBACK' | 'VOICE_FORMATTING';
  message: string;
  suggestion: string;
}

export interface PromptTemplate {
  id: string;
  merchantId: string;
  title: string;
  category: PromptCategory;
  content: string;
  version: string;
  active: boolean;
  variables: string[];
  hygieneWarnings: HygieneWarning[];
  createdAt: string;
  updatedAt: string;
}

export interface FlowStep {
  id: string;
  label: string;
  action: string;
  description: string;
}

export interface ConversationFlow {
  id: string;
  flowId: string;
  name: string;
  category: PromptCategory;
  description: string;
  steps: FlowStep[];
  isActive: boolean;
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
}

export interface ToolResult {
  toolCallId: string;
  name: string;
  result: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

export interface Conversation {
  id: string;
  merchantId: string;
  customerName?: string;
  language: 'english' | 'hindi' | 'hinglish';
  status: 'active' | 'completed' | 'failed';
  messages: ChatMessage[];
  detectedIntent: string;
  promptVersion: string;
  totalLatencyMs: number;
  createdAt: string;
}

export interface EvaluationTestCase {
  id: string;
  merchantId: string;
  name: string;
  category: string;
  input: string;
  expectedBehavior: string;
  lastRunResult?: EvaluationResult;
}

export interface EvaluationResult {
  id: string;
  testId: string;
  testName: string;
  category: string;
  merchantId: string;
  promptId: string;
  input: string;
  expectedBehavior: string;
  actualResponse: string;
  passed: boolean;
  score: number; // 0 to 100
  failureReason?: string;
  latencyMs: number;
  timestamp: string;
}

export interface CallLog {
  id: string;
  conversationId: string;
  merchantId: string;
  merchantName: string;
  customerTranscript: string;
  agentResponse: string;
  durationSeconds: number;
  detectedIntent: string;
  detectedLanguage: 'english' | 'hindi' | 'hinglish';
  latencyMs: number;
  wordCount: number;
  status: 'successful' | 'break_detected';
  breakCategory?: 'Repetition' | 'Wrong data' | 'Long response' | 'Wrong language' | 'Failed tool call' | 'Missing product' | 'Incorrect price' | 'Incorrect discount' | 'Conversation loop' | 'Hallucination' | 'TTS formatting issue';
  breakReason?: string;
  promptFixRecommendation?: string;
  promptVersion: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  successRatePercentage: number;
  averageResponseTimeMs: number;
  averageResponseWords: number;
  promptFailures: number;
  dataFailures: number;
  languageFailures: number;
  totalToolCalls: number;
  evaluationPassRatePercentage: number;
  callsOverTime: Array<{ date: string; calls: number; breaks: number }>;
  breakDistribution: Array<{ category: string; count: number }>;
  latencyBreakdown: Array<{ step: string; latencyMs: number }>;
}

export interface PriceCalculationResult {
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
  currency: string;
  appliedDiscountCode?: string;
  formattedOriginalPrice: string;
  formattedFinalPrice: string;
  speechFormattedPrice: string;
  isValid: boolean;
  errorMessage?: string;
}
