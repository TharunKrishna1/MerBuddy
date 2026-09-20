from typing import List, Optional, Tuple
from schemas import DiscountRule
from data.mock_products import mock_discount_rules

class DiscountService:
    def __init__(self):
        self.rules: List[DiscountRule] = mock_discount_rules

    def get_rules_by_merchant(self, merchant_id: str) -> List[DiscountRule]:
        return [r for r in self.rules if r.merchantId == merchant_id and r.active]

    def validate_coupon(self, merchant_id: str, code: str, order_value: float) -> Tuple[bool, Optional[DiscountRule], str]:
        clean_code = code.strip().upper()
        rule = next((r for r in self.rules if r.merchantId == merchant_id and r.code.upper() == clean_code and r.active), None)

        if not rule:
            return False, None, f"Coupon code '{code}' is invalid or expired."

        if rule.minOrderValue and order_value < rule.minOrderValue:
            return False, rule, f"Coupon '{code}' requires a minimum order value of ₹{int(rule.minOrderValue):,}."

        return True, rule, f"Coupon '{code}' applied successfully."

discount_service = DiscountService()
