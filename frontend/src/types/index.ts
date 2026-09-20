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
  value: number;
  minOrderValue?: number;
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

export interface EvaluationTestCase {
  id: string;
  merchantId: string;
  name: string;
  category: string;
  input: string;
  expectedBehavior: string;
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
  score: number;
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
  breakCategory?: string;
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

export interface ChatResponsePayload {
  success: boolean;
  conversationId: string;
  detectedLanguage: 'english' | 'hindi' | 'hinglish';
  merchantId: string;
  merchantName: string;
  intent: string;
  currentFlow: ConversationFlow;
  response: string;
  rawLlmResponse: string;
  toolsCalled: ToolCall[];
  toolResults: ToolResult[];
  metadata: {
    promptVersion: string;
    latencyMs: number;
    wordCount: number;
    breakDetected: boolean;
    breakReason?: string;
  };
}
