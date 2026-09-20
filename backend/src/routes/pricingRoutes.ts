import { Router, Request, Response } from 'express';
import { pricingService } from '../services/pricingService';
import { discountService } from '../services/discountService';

const router = Router();

// POST /api/pricing/calculate
router.post('/calculate', (req: Request, res: Response) => {
  const { originalPrice, currency, discountPercentage } = req.body;
  const result = pricingService.calculatePrice(originalPrice, currency || 'INR', null, discountPercentage);
  res.json({ success: true, data: result });
});

// POST /api/discounts/apply
router.post('/apply', (req: Request, res: Response) => {
  const { merchantId, couponCode, orderValue } = req.body;
  if (!couponCode || !orderValue) {
    return res.status(400).json({ success: false, error: 'couponCode and orderValue are required.' });
  }

  const validation = discountService.validateCoupon(merchantId || 'merchant_001', couponCode, orderValue);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, error: validation.message });
  }

  const result = pricingService.calculatePrice(orderValue, 'INR', validation.rule);
  res.json({ success: true, message: validation.message, data: result });
});

export default router;
