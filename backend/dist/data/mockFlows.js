"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockFlows = void 0;
exports.mockFlows = [
    {
        id: 'flow_001',
        flowId: 'product_search',
        name: 'Product Discovery & Stock Check',
        category: 'PRODUCT_DISCOVERY',
        description: 'Standard flow when customer inquires about footwear or apparel attributes (color, size, category).',
        isActive: true,
        steps: [
            { id: 's1', label: 'Understand Requirement', action: 'parse_user_intent', description: 'Extract category, size, color, gender from user audio/text.' },
            { id: 's2', label: 'Extract Attributes', action: 'extract_attributes', description: 'Identify parameters like size=9, color=black, category=running shoes.' },
            { id: 's3', label: 'Search Products', action: 'search_products_tool', description: 'Query product database via search_products tool call.' },
            { id: 's4', label: 'Check Inventory', action: 'check_inventory_tool', description: 'Verify size variant quantity > 0 in real-time.' },
            { id: 's5', label: 'Apply Discount', action: 'calculate_discount', description: 'Compute active promotional discounts via pricing engine.' },
            { id: 's6', label: 'Present Product', action: 'generate_voice_response', description: 'Synthesize short voice response with price & availability.' }
        ]
    },
    {
        id: 'flow_002',
        flowId: 'discount_inquiry',
        name: 'Discount & Coupon Evaluation',
        category: 'DISCOUNT_QUERY',
        description: 'Flow for validating coupon codes and presenting promotional savings.',
        isActive: true,
        steps: [
            { id: 's1', label: 'Identify Coupon Code', action: 'extract_coupon', description: 'Extract promo code (e.g. FESTIVE20) from user inquiry.' },
            { id: 's2', label: 'Validate Rules', action: 'validate_discount_rules', description: 'Verify minimum order value and active status in backend.' },
            { id: 's3', label: 'Calculate Final Price', action: 'compute_pricing', description: 'Execute pricing engine calculation.' },
            { id: 's4', label: 'Respond Voice', action: 'tts_response', description: 'Present exact savings in speech-friendly words.' }
        ]
    },
    {
        id: 'flow_003',
        flowId: 'order_status',
        name: 'Order Status Lookup',
        category: 'ORDER_STATUS',
        description: 'Flow for tracking dispatch and shipping updates via order ID.',
        isActive: true,
        steps: [
            { id: 's1', label: 'Request Order ID', action: 'prompt_order_id', description: 'Ask customer for 5-digit order number.' },
            { id: 's2', label: 'Verify Order ID', action: 'validate_order_id', description: 'Ensure order number is valid format.' },
            { id: 's3', label: 'Fetch Tracking Data', action: 'get_order_status_tool', description: 'Retrieve shipment status from logistics backend.' },
            { id: 's4', label: 'State Delivery ETA', action: 'respond_eta', description: 'Provide delivery date and tracking link notification.' }
        ]
    },
    {
        id: 'flow_004',
        flowId: 'out_of_stock',
        name: 'Out-of-Stock Handling & Alternatives',
        category: 'OUT_OF_STOCK',
        description: 'Flow triggered when requested variant inventory is zero.',
        isActive: true,
        steps: [
            { id: 's1', label: 'Detect Zero Stock', action: 'inventory_zero_alert', description: 'Identify requested size/color quantity is 0.' },
            { id: 's2', label: 'Search Similar Products', action: 'find_alternatives', description: 'Find available matching colors or similar model in same size.' },
            { id: 's3', label: 'Recommend Alternative', action: 'suggest_alternative_voice', description: 'Politely inform out of stock and offer top alternative.' }
        ]
    }
];
