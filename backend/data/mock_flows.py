from schemas import ConversationFlow, FlowStep

mock_flows = [
    ConversationFlow(
        id='flow_001',
        flowId='product_search',
        name='Product Discovery & Stock Check',
        category='PRODUCT_DISCOVERY',
        description='Standard flow when customer inquires about footwear or apparel attributes (color, size, category).',
        isActive=True,
        steps=[
            FlowStep(id='s1', label='Understand Requirement', action='parse_user_intent', description='Extract category, size, color, gender from user audio/text.'),
            FlowStep(id='s2', label='Extract Attributes', action='extract_attributes', description='Identify parameters like size=9, color=black, category=running shoes.'),
            FlowStep(id='s3', label='Search Products', action='search_products_tool', description='Query product database via search_products tool call.'),
            FlowStep(id='s4', label='Check Inventory', action='check_inventory_tool', description='Verify size variant quantity > 0 in real-time.'),
            FlowStep(id='s5', label='Apply Discount', action='calculate_discount', description='Compute active promotional discounts via pricing engine.'),
            FlowStep(id='s6', label='Present Product', action='generate_voice_response', description='Synthesize short voice response with price & availability.')
        ]
    ),
    ConversationFlow(
        id='flow_002',
        flowId='discount_inquiry',
        name='Discount & Coupon Evaluation',
        category='DISCOUNT_QUERY',
        description='Flow for validating coupon codes and presenting promotional savings.',
        isActive=True,
        steps=[
            FlowStep(id='s1', label='Identify Coupon Code', action='extract_coupon', description='Extract promo code (e.g. FESTIVE20) from user inquiry.'),
            FlowStep(id='s2', label='Validate Rules', action='validate_discount_rules', description='Verify minimum order value and active status in backend.'),
            FlowStep(id='s3', label='Calculate Final Price', action='compute_pricing', description='Execute pricing engine calculation.'),
            FlowStep(id='s4', label='Respond Voice', action='tts_response', description='Present exact savings in speech-friendly words.')
        ]
    ),
    ConversationFlow(
        id='flow_003',
        flowId='order_status',
        name='Order Status Lookup',
        category='ORDER_STATUS',
        description='Flow for tracking dispatch and shipping updates via order ID.',
        isActive=True,
        steps=[
            FlowStep(id='s1', label='Request Order ID', action='prompt_order_id', description='Ask customer for 5-digit order number.'),
            FlowStep(id='s2', label='Verify Order ID', action='validate_order_id', description='Ensure order number is valid format.'),
            FlowStep(id='s3', label='Fetch Tracking Data', action='get_order_status_tool', description='Retrieve shipment status from logistics backend.'),
            FlowStep(id='s4', label='State Delivery ETA', action='respond_eta', description='Provide delivery date and tracking link notification.')
        ]
    )
]
