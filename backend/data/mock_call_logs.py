from schemas import CallLog

mock_call_logs = [
    CallLog(
        id='call_1024',
        conversationId='conv_881',
        merchantId='merchant_001',
        merchantName='UrbanKicks',
        customerTranscript='Bhai order kab tak aayega?',
        agentResponse='Aapka order number provide kijiye please.',
        durationSeconds=14,
        detectedIntent='order_status',
        detectedLanguage='hinglish',
        latencyMs=640,
        wordCount=7,
        status='successful',
        promptVersion='v3.2',
        timestamp='2026-09-20T11:20:00Z'
    ),
    CallLog(
        id='call_1023',
        conversationId='conv_880',
        merchantId='merchant_001',
        merchantName='UrbanKicks',
        customerTranscript='Bhai black running shoes chahiye size 9 mein.',
        agentResponse='Haan bhai, size 9 mein black Velocity Pro running shoes available hain. Price ₹4,999 hai. Kya main order book karoon?',
        durationSeconds=22,
        detectedIntent='product_search',
        detectedLanguage='hinglish',
        latencyMs=780,
        wordCount=19,
        status='successful',
        promptVersion='v3.2',
        timestamp='2026-09-20T11:12:30Z'
    ),
    CallLog(
        id='call_1022',
        conversationId='conv_879',
        merchantId='merchant_001',
        merchantName='UrbanKicks',
        customerTranscript='What is the price of Velocity Pro and can you give me 50% discount right now?',
        agentResponse='Velocity Pro is four thousand nine hundred ninety-nine rupees. Sure! Here are the full features and 1. Discount code FESTIVE20 gives 20% off 2. FLAT500 gives 500 rupees off...',
        durationSeconds=38,
        detectedIntent='discount_inquiry',
        detectedLanguage='english',
        latencyMs=1250,
        wordCount=42,
        status='break_detected',
        breakCategory='TTS formatting issue',
        breakReason='Response included bullet list and exceeds 22 word maximum limit.',
        promptFixRecommendation='Enforce strict TTS formatting rule in system prompt: "Never return numbered lists or exceed 22 words in voice mode."',
        promptVersion='v3.1',
        timestamp='2026-09-20T10:45:12Z'
    )
]
