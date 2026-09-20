"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingService = exports.PricingService = void 0;
exports.numberToWordsRupees = numberToWordsRupees;
/**
 * Speech number converter for prices in Indian Rupees
 */
function numberToWordsRupees(num) {
    if (isNaN(num) || num < 0)
        return 'zero rupees';
    const rounded = Math.round(num);
    if (rounded === 0)
        return 'zero rupees';
    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    function convertHundreds(n) {
        let str = '';
        if (n >= 100) {
            str += units[Math.floor(n / 100)] + ' hundred ';
            n %= 100;
        }
        if (n >= 20) {
            const tenVal = Math.floor(n / 10);
            const unitVal = n % 10;
            str += tens[tenVal] + (unitVal > 0 ? '-' + units[unitVal] : '') + ' ';
            n = 0;
        }
        else if (n > 0) {
            str += units[n] + ' ';
        }
        return str.trim();
    }
    let result = '';
    let temp = rounded;
    if (temp >= 100000) {
        const lakh = Math.floor(temp / 100000);
        result += convertHundreds(lakh) + ' lakh ';
        temp %= 100000;
    }
    if (temp >= 1000) {
        const thousand = Math.floor(temp / 1000);
        result += convertHundreds(thousand) + ' thousand ';
        temp %= 1000;
    }
    if (temp > 0) {
        result += convertHundreds(temp);
    }
    return (result.trim() + ' rupees').replaceAll(/\s+/g, ' ');
}
class PricingService {
    /**
     * Calculate final price applying optional discount code or percentage
     */
    calculatePrice(originalPrice, currency = 'INR', discountRule, manualDiscountPercentage) {
        // Edge case validation
        if (typeof originalPrice !== 'number' || isNaN(originalPrice)) {
            return {
                originalPrice: 0,
                discountPercentage: 0,
                discountAmount: 0,
                finalPrice: 0,
                currency,
                formattedOriginalPrice: `₹0`,
                formattedFinalPrice: `₹0`,
                speechFormattedPrice: 'zero rupees',
                isValid: false,
                errorMessage: 'Invalid original price provided.'
            };
        }
        if (originalPrice < 0) {
            return {
                originalPrice,
                discountPercentage: 0,
                discountAmount: 0,
                finalPrice: 0,
                currency,
                formattedOriginalPrice: `₹${originalPrice}`,
                formattedFinalPrice: `₹0`,
                speechFormattedPrice: 'zero rupees',
                isValid: false,
                errorMessage: 'Original price cannot be negative.'
            };
        }
        let discountPercentage = 0;
        let discountAmount = 0;
        let appliedCode = undefined;
        if (discountRule && discountRule.active) {
            appliedCode = discountRule.code;
            if (discountRule.type === 'percentage') {
                discountPercentage = Math.min(Math.max(discountRule.value, 0), 100);
                discountAmount = Math.round((originalPrice * discountPercentage) / 100);
            }
            else if (discountRule.type === 'fixed') {
                discountAmount = Math.min(Math.max(discountRule.value, 0), originalPrice);
                discountPercentage = originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;
            }
        }
        else if (typeof manualDiscountPercentage === 'number' && manualDiscountPercentage > 0) {
            discountPercentage = Math.min(manualDiscountPercentage, 100);
            discountAmount = Math.round((originalPrice * discountPercentage) / 100);
        }
        // Ensure final price is non-negative
        const finalPrice = Math.max(0, originalPrice - discountAmount);
        const formattedOriginalPrice = `${currency === 'INR' ? '₹' : currency + ' '}${originalPrice.toLocaleString('en-IN')}`;
        const formattedFinalPrice = `${currency === 'INR' ? '₹' : currency + ' '}${finalPrice.toLocaleString('en-IN')}`;
        const speechFormattedPrice = numberToWordsRupees(finalPrice);
        return {
            originalPrice,
            discountPercentage,
            discountAmount,
            finalPrice,
            currency,
            appliedDiscountCode: appliedCode,
            formattedOriginalPrice,
            formattedFinalPrice,
            speechFormattedPrice,
            isValid: true
        };
    }
}
exports.PricingService = PricingService;
exports.pricingService = new PricingService();
