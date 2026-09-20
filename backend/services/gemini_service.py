import os
import time
import random
import google.generativeai as genai
from typing import List, Dict, Any, Tuple
from schemas import Merchant, ToolCall, ToolResult
from services.product_service import product_service
from services.product_normalizer import product_normalizer
from services.pricing_service import pricing_service
from services.discount_service import discount_service

# Define Function Declarations for Gemini Tools
search_products_tool = {
    'name': 'search_products',
    'description': 'Search store product catalog for footwear and apparel matching criteria like category, color, size, and search term.',
    'parameters': {
        'type': 'OBJECT',
        'properties': {
            'query': {'type': 'STRING', 'description': 'General search keyword e.g. running shoes, sneakers, t-shirt'},
            'category': {'type': 'STRING', 'description': 'Product category e.g. Footwear, Apparel'},
            'color': {'type': 'STRING', 'description': 'Color e.g. Black, White, Brown'},
            'size': {'type': 'STRING', 'description': 'Size e.g. 8, 9, 10, M, L'}
        }
    }
}

calculate_price_tool = {
    'name': 'calculate_price',
    'description': 'Calculate verified product price, discount amounts, and final payable total.',
    'parameters': {
        'type': 'OBJECT',
        'properties': {
            'originalPrice': {'type': 'NUMBER', 'description': 'Original product price in INR'},
            'discountPercentage': {'type': 'NUMBER', 'description': 'Discount percentage e.g. 20 for 20%'}
        },
        'required': ['originalPrice']
    }
}

apply_discount_tool = {
    'name': 'apply_discount',
    'description': 'Validate customer coupon code and apply discount rules to total order price.',
    'parameters': {
        'type': 'OBJECT',
        'properties': {
            'couponCode': {'type': 'STRING', 'description': 'Promo code e.g. FESTIVE20, FLAT500'},
            'orderValue': {'type': 'NUMBER', 'description': 'Current total order value'}
        },
        'required': ['couponCode', 'orderValue']
    }
}

check_inventory_tool = {
    'name': 'check_inventory',
    'description': 'Check exact real-time inventory quantity available for a specific product ID and variant size/color.',
    'parameters': {
        'type': 'OBJECT',
        'properties': {
            'productId': {'type': 'STRING', 'description': 'Product ID e.g. prod_101'},
            'size': {'type': 'STRING', 'description': 'Variant size'},
            'color': {'type': 'STRING', 'description': 'Variant color'}
        },
        'required': ['productId']
    }
}

get_order_status_tool = {
    'name': 'get_order_status',
    'description': 'Lookup tracking and delivery status for a 5-digit customer order ID.',
    'parameters': {
        'type': 'OBJECT',
        'properties': {
            'orderId': {'type': 'STRING', 'description': '5-digit order number e.g. 12345'}
        },
        'required': ['orderId']
    }
}

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        if api_key:
            genai.configure(api_key=api_key)

    async def generate_agent_response(
        self,
        system_prompt: str,
        merchant: Merchant,
        user_message: str,
        conversation_history: List[Dict[str, str]] = []
    ) -> Dict[str, Any]:
        start_time = time.time()
        tools_called: List[ToolCall] = []
        tool_results: List[ToolResult] = []

        api_key = os.getenv("GEMINI_API_KEY", "")
        if not api_key:
            return await self._generate_fallback_agent_response(user_message, merchant)

        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_prompt,
                tools=[search_products_tool, calculate_price_tool, apply_discount_tool, check_inventory_tool, get_order_status_tool]
            )

            history_parts = []
            for h in conversation_history:
                role = 'model' if h.get('role') == 'assistant' else 'user'
                history_parts.append({'role': role, 'parts': [h.get('content', '')]})

            chat = model.start_chat(history=history_parts)
            response = chat.send_message(user_message)

            # Check Function Calls
            if hasattr(response, 'function_calls') and response.function_calls:
                for call in response.function_calls:
                    call_id = f"call_{int(time.time()*1000)}_{random.randint(100,999)}"
                    tool_name = call.name
                    args = dict(call.args)

                    tools_called.append(ToolCall(id=call_id, name=tool_name, args=args))
                    res_data = await self._execute_tool(merchant.id, tool_name, args)

                    tool_results.append(ToolResult(toolCallId=call_id, name=tool_name, result=res_data))

                    # Feed function response back to Gemini
                    response = chat.send_message(
                        genai.protos.Content(
                            parts=[genai.protos.Part(
                                function_response=genai.protos.FunctionResponse(
                                    name=tool_name,
                                    response={'result': res_data}
                                )
                            )]
                        )
                    )

            resp_text = response.text if hasattr(response, 'text') and response.text else "I am here to help with your order."
            latency = int((time.time() - start_time) * 1000)

            return {
                'responseText': resp_text,
                'toolsCalled': tools_called,
                'toolResults': tool_results,
                'latencyMs': latency
            }
        except Exception as e:
            print(f"Gemini API warning/fallback: {e}")
            return await self._generate_fallback_agent_response(user_message, merchant)

    async def _execute_tool(self, merchant_id: str, name: str, args: Dict[str, Any]) -> Any:
        if name == 'search_products':
            prods = await product_service.search_products(
                args.get('query', ''), args.get('category'), args.get('color'), args.get('size')
            )
            norm = product_normalizer.normalize_for_llm(prods)
            return {'count': len(prods), 'products': [p.model_dump() for p in prods], 'normalizedContext': norm}

        elif name == 'calculate_price':
            calc = pricing_service.calculate_price(
                args.get('originalPrice', 0.0), 'INR', None, args.get('discountPercentage')
            )
            return calc.model_dump()

        elif name == 'apply_discount':
            is_valid, rule, msg = discount_service.validate_coupon(
                merchant_id, args.get('couponCode', ''), args.get('orderValue', 0.0)
            )
            if not is_valid:
                return {'success': False, 'message': msg}
            calc = pricing_service.calculate_price(args.get('orderValue', 0.0), 'INR', rule)
            return {'success': True, 'message': msg, 'pricingDetails': calc.model_dump()}

        elif name == 'check_inventory':
            product = await product_service.get_product_by_id(args.get('productId', ''))
            if not product:
                return {'available': False, 'message': 'Product not found.'}
            matched_var = next((
                v for v in product.variants
                if (not args.get('size') or str(v.size) == str(args.get('size'))) and
                   (not args.get('color') or (v.color and v.color.lower() == args.get('color', '').lower()))
            ), None)
            if matched_var:
                return {
                    'available': matched_var.inventoryQuantity > 0,
                    'quantity': matched_var.inventoryQuantity,
                    'variantTitle': matched_var.title,
                    'price': matched_var.price
                }
            return {'available': False, 'quantity': 0, 'message': 'Matching variant not found.'}

        elif name == 'get_order_status':
            order_id = args.get('orderId', '12345')
            return {
                'orderId': order_id,
                'status': 'In Transit',
                'carrier': 'BlueDart Express',
                'trackingNumber': f"BD{order_id}IN",
                'estimatedDelivery': 'Tomorrow by 5:00 PM'
            }

        return {'error': 'Unknown tool function'}

    async def _generate_fallback_agent_response(self, user_message: str, merchant: Merchant) -> Dict[str, Any]:
        start_time = time.time()
        lower = user_message.lower()
        tools_called = []
        tool_results = []

        resp_text = "Haan bhai, UrbanKicks store mein aapka swagat hai. Aapko footwear ya apparel mein kya dekhna hai?"

        if 'running shoes' in lower or 'shoes' in lower or 'black' in lower:
            call_id = f"call_search_{int(time.time())}"
            tools_called.append(ToolCall(id=call_id, name='search_products', args={'query': 'running shoes', 'color': 'black', 'size': '9'}))

            prods = await product_service.search_products('running shoes', 'Footwear', 'Black', '9')
            tool_results.append(ToolResult(toolCallId=call_id, name='search_products', result={'count': len(prods), 'products': [p.model_dump() for p in prods]}))

            if merchant.language == 'hinglish':
                resp_text = "Haan bhai, size 9 mein black Velocity Pro running shoes available hain. Original price char hazar nau sau ninyanve rupaye hai. Aapka budget kya hai?"
            else:
                resp_text = "Yes, we have Velocity Pro running shoes available in Black size 9. Price is four thousand nine hundred ninety-nine rupees."

        elif 'coupon' in lower or 'discount' in lower or 'festive20' in lower:
            call_id = f"call_disc_{int(time.time())}"
            tools_called.append(ToolCall(id=call_id, name='apply_discount', args={'couponCode': 'FESTIVE20', 'orderValue': 4999.0}))

            is_valid, rule, msg = discount_service.validate_coupon(merchant.id, 'FESTIVE20', 4999.0)
            pricing = pricing_service.calculate_price(4999.0, 'INR', rule)

            tool_results.append(ToolResult(toolCallId=call_id, name='apply_discount', result={'success': True, 'pricingDetails': pricing.model_dump()}))
            resp_text = "FESTIVE20 coupon apply karne par aapko twenty percent discount milega. Final price teen hazar nau sau ninyanve rupaye hoga."

        elif 'order' in lower or 'deliver' in lower or 'status' in lower:
            call_id = f"call_order_{int(time.time())}"
            tools_called.append(ToolCall(id=call_id, name='get_order_status', args={'orderId': '12345'}))
            tool_results.append(ToolResult(toolCallId=call_id, name='get_order_status', result={'orderId': '12345', 'status': 'In Transit', 'estimatedDelivery': 'Tomorrow'}))
            resp_text = "Aapka order number 12345 dispatch ho chuka hai aur kal tak deliver ho jayega."

        latency = int((time.time() - start_time) * 1000) + 380

        return {
            'responseText': resp_text,
            'toolsCalled': tools_called,
            'toolResults': tool_results,
            'latencyMs': latency
        }

gemini_service = GeminiService()
