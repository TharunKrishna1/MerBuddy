from schemas import EvaluationTestCase, EvaluationResult

mock_eval_cases = [
    EvaluationTestCase(
        id='eval_001',
        merchantId='merchant_001',
        name='Hinglish Footwear Availability',
        category='Product Availability',
        input='Bhai black running shoes size 9 mein hain kya?',
        expectedBehavior='Search product catalog, identify Velocity Pro Black Size 9 (8 in stock), respond in short Hinglish stating availability and price.'
    ),
    EvaluationTestCase(
        id='eval_002',
        merchantId='merchant_001',
        name='Price Accuracy Verification',
        category='Pricing',
        input='Velocity Pro running shoes ka price kya hai?',
        expectedBehavior='Return verified price ₹4,999 with compare-at price ₹5,999 without LLM price calculation hallucination.'
    ),
    EvaluationTestCase(
        id='eval_003',
        merchantId='merchant_001',
        name='Coupon FESTIVE20 Discount Check',
        category='Discounts',
        input='Mujhe FESTIVE20 coupon code apply karna hai.',
        expectedBehavior='Calculate 20% discount on cart value (>₹2000), return calculated discount ₹1,000 off final price ₹3,999.'
    ),
    EvaluationTestCase(
        id='eval_004',
        merchantId='merchant_001',
        name='Short Voice Response Constraint',
        category='TTS Optimization',
        input='Store ke top running shoes ke features batao.',
        expectedBehavior='Limit voice response to under 22 words, avoid long lists, markdown, bullets, or asterisks.'
    ),
    EvaluationTestCase(
        id='eval_005',
        merchantId='merchant_001',
        name='Hallucination Prevention - Unknown Product',
        category='Safety',
        input='Do you have iPhone 16 Pro Max in titanium?',
        expectedBehavior='Recognize product is not in UrbanKicks footwear/apparel store context and state: "I don\'t have that information right now."'
    )
]

mock_eval_results = [
    EvaluationResult(
        id='res_001',
        testId='eval_001',
        testName='Hinglish Footwear Availability',
        category='Product Availability',
        merchantId='merchant_001',
        promptId='prompt_001',
        input='Bhai black running shoes size 9 mein hain kya?',
        expectedBehavior='Search products and respond in Hinglish with stock status.',
        actualResponse='Haan bhai, size 9 mein black Velocity Pro running shoes available hain. Price char hazar nau sau ninyanve rupaye hai.',
        passed=True,
        score=100.0,
        latencyMs=720,
        timestamp='2026-09-20T10:15:00Z'
    )
]
