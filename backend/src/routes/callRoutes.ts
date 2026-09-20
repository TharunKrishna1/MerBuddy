import { Router, Request, Response } from 'express';
import { callLogService } from '../services/callLogService';

const router = Router();

// GET /api/calls
router.get('/', (req: Request, res: Response) => {
  const merchantId = req.query.merchantId as string;
  const calls = callLogService.getCallLogs(merchantId);
  res.json({ success: true, count: calls.length, data: calls });
});

// GET /api/calls/:id
router.get('/:id', (req: Request, res: Response) => {
  const call = callLogService.getCallById(req.params.id);
  if (!call) {
    return res.status(404).json({ success: false, error: 'Call log entry not found' });
  }
  res.json({ success: true, data: call });
});

export default router;
