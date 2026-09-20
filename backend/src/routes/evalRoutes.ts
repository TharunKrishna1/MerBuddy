import { Router, Request, Response } from 'express';
import { evalService } from '../services/evalService';
import { mockMerchants } from '../data/mockMerchants';

const router = Router();

// GET /api/evaluations
router.get('/', (req: Request, res: Response) => {
  const merchantId = req.query.merchantId as string;
  const testCases = evalService.getTestCases(merchantId);
  const results = evalService.getResults(merchantId);
  res.json({ success: true, count: results.length, testCases, data: results });
});

// GET /api/evaluations/:id
router.get('/:id', (req: Request, res: Response) => {
  const results = evalService.getResults();
  const found = results.find(r => r.id === req.params.id || r.testId === req.params.id);
  if (!found) {
    return res.status(404).json({ success: false, error: 'Evaluation result not found' });
  }
  res.json({ success: true, data: found });
});

// POST /api/evaluations/run
router.post('/run', async (req: Request, res: Response) => {
  try {
    const { merchantId = 'merchant_001', promptId } = req.body;
    const merchant = mockMerchants.find(m => m.id === merchantId) || mockMerchants[0];

    const results = await evalService.runEvaluations(merchant, promptId);

    const total = results.length;
    const passed = results.filter(r => r.passed).length;

    res.json({
      success: true,
      summary: {
        totalTests: total,
        passed,
        failed: total - passed,
        passRatePercentage: Math.round((passed / total) * 100)
      },
      data: results
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
