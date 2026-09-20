import { DiscountRule } from '../types';
import { mockDiscountRules } from '../data/mockProducts';

export class DiscountService {
  private discountRules: DiscountRule[] = mockDiscountRules;

  public getRulesByMerchant(merchantId: string): DiscountRule[] {
    return this.discountRules.filter(r => r.merchantId === merchantId && r.active);
  }

  public validateCoupon(merchantId: string, code: string, orderValue: number): { isValid: boolean; rule?: DiscountRule; message: string } {
    const cleanCode = code.trim().toUpperCase();
    const rule = this.discountRules.find(r => r.merchantId === merchantId && r.code.toUpperCase() === cleanCode && r.active);

    if (!rule) {
      return { isValid: false, message: `Coupon code '${code}' is invalid or expired.` };
    }

    if (rule.minOrderValue && orderValue < rule.minOrderValue) {
      return {
        isValid: false,
        rule,
        message: `Coupon '${code}' requires a minimum order value of ₹${rule.minOrderValue.toLocaleString('en-IN')}.`
      };
    }

    return {
      isValid: true,
      rule,
      message: `Coupon '${code}' applied successfully.`
    };
  }
}

export const discountService = new DiscountService();
