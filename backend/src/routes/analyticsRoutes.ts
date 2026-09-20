import { Router, Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';

const router = Router();

// GET /api/analytics
router.get('/', (req: Request, res: Response) => {
  const merchantId = req.query.merchantId as string;
  const summary = analyticsService.getAnalyticsSummary(merchantId);
  res.json({ success: true, data: summary });
});

export default router;
