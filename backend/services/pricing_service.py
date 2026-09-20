import math
from typing import Optional
from schemas import PriceCalculationResult, DiscountRule

def number_to_words_rupees(num: float) -> str:
    if math.isnan(num) or num < 0:
        return 'zero rupees'
    rounded = round(num)
    if rounded == 0:
        return 'zero rupees'

    units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
             'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

    def convert_hundreds(n: int) -> str:
        s = ''
        if n >= 100:
            s += units[n // 100] + ' hundred '
            n %= 100
        if n >= 20:
            ten_val = n // 10
            unit_val = n % 10
            s += tens[ten_val] + (('-' + units[unit_val]) if unit_val > 0 else '') + ' '
            n = 0
        elif n > 0:
            s += units[n] + ' '
        return s.strip()

    result = ''
    temp = rounded

    if temp >= 100000:
        lakh = temp // 100000
        result += convert_hundreds(lakh) + ' lakh '
        temp %= 100000
    if temp >= 1000:
        thousand = temp // 1000
        result += convert_hundreds(thousand) + ' thousand '
        temp %= 1000
    if temp > 0:
        result += convert_hundreds(temp)

    clean_res = ' '.join(result.strip().split()) + ' rupees'
    return clean_res

class PricingService:
    def calculate_price(
        self,
        original_price: float,
        currency: str = 'INR',
        discount_rule: Optional[DiscountRule] = None,
        manual_discount_percentage: Optional[float] = None
    ) -> PriceCalculationResult:
        if original_price is None or math.isnan(original_price):
            return PriceCalculationResult(
                originalPrice=0.0,
                discountPercentage=0.0,
                discountAmount=0.0,
                finalPrice=0.0,
                currency=currency,
                formattedOriginalPrice='₹0',
                formattedFinalPrice='₹0',
                speechFormattedPrice='zero rupees',
                isValid=False,
                errorMessage='Invalid original price provided.'
            )

        if original_price < 0:
            return PriceCalculationResult(
                originalPrice=original_price,
                discountPercentage=0.0,
                discountAmount=0.0,
                finalPrice=0.0,
                currency=currency,
                formattedOriginalPrice=f'₹{original_price}',
                formattedFinalPrice='₹0',
                speechFormattedPrice='zero rupees',
                isValid=False,
                errorMessage='Original price cannot be negative.'
            )

        discount_percentage = 0.0
        discount_amount = 0.0
        applied_code = None

        if discount_rule and discount_rule.active:
            applied_code = discount_rule.code
            if discount_rule.type == 'percentage':
                discount_percentage = min(max(discount_rule.value, 0.0), 100.0)
                discount_amount = round((original_price * discount_percentage) / 100.0)
            elif discount_rule.type == 'fixed':
                discount_amount = min(max(discount_rule.value, 0.0), original_price)
                discount_percentage = round((discount_amount / original_price) * 100.0) if original_price > 0 else 0.0
        elif manual_discount_percentage is not None and manual_discount_percentage > 0:
            discount_percentage = min(manual_discount_percentage, 100.0)
            discount_amount = round((original_price * discount_percentage) / 100.0)

        final_price = max(0.0, original_price - discount_amount)
        formatted_orig = f"₹{int(original_price):,}" if currency == 'INR' else f"{currency} {original_price}"
        formatted_final = f"₹{int(final_price):,}" if currency == 'INR' else f"{currency} {final_price}"
        speech_price = number_to_words_rupees(final_price)

        return PriceCalculationResult(
            originalPrice=original_price,
            discountPercentage=discount_percentage,
            discountAmount=discount_amount,
            finalPrice=final_price,
            currency=currency,
            appliedDiscountCode=applied_code,
            formattedOriginalPrice=formatted_orig,
            formattedFinalPrice=formatted_final,
            speechFormattedPrice=speech_price,
            isValid=True
        )

pricing_service = PricingService()
