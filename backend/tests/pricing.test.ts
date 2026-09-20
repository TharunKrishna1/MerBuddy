import { describe, it, expect } from 'vitest';
import { pricingService, numberToWordsRupees } from '../src/services/pricingService';
import { DiscountRule } from '../src/types';

describe('Pricing Engine Unit Tests', () => {
  it('calculates 20% percentage discount correctly', () => {
    const rule: DiscountRule = {
      id: 'd1', merchantId: 'm1', code: 'PROMO20', type: 'percentage', value: 20, active: true
    };
    const res = pricingService.calculatePrice(2000, 'INR', rule);
    expect(res.originalPrice).toBe(2000);
    expect(res.discountAmount).toBe(400);
    expect(res.finalPrice).toBe(1600);
    expect(res.formattedFinalPrice).toBe('₹1,600');
    expect(res.isValid).toBe(true);
  });

  it('calculates fixed discount correctly', () => {
    const rule: DiscountRule = {
      id: 'd2', merchantId: 'm1', code: 'FLAT500', type: 'fixed', value: 500, active: true
    };
    const res = pricingService.calculatePrice(4999, 'INR', rule);
    expect(res.discountAmount).toBe(500);
    expect(res.finalPrice).toBe(4499);
  });

  it('handles edge case: discount greater than original price', () => {
    const rule: DiscountRule = {
      id: 'd3', merchantId: 'm1', code: 'SUPER1000', type: 'fixed', value: 1000, active: true
    };
    const res = pricingService.calculatePrice(500, 'INR', rule);
    expect(res.finalPrice).toBe(0);
    expect(res.discountAmount).toBe(500);
  });

  it('handles edge case: negative original price', () => {
    const res = pricingService.calculatePrice(-200, 'INR');
    expect(res.isValid).toBe(false);
    expect(res.finalPrice).toBe(0);
  });

  it('converts prices to speech words correctly', () => {
    expect(numberToWordsRupees(4999)).toBe('four thousand nine hundred ninety-nine rupees');
    expect(numberToWordsRupees(1500)).toBe('one thousand five hundred rupees');
  });
});
