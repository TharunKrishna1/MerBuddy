import { Router, Request, Response } from 'express';
import { productService } from '../services/productService';

const router = Router();

// GET /api/products/search
router.get('/search', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    const category = req.query.category as string;
    const color = req.query.color as string;
    const size = req.query.size as string;

    const products = await productService.searchProducts(query, category, color, size);
    res.json({ success: true, count: products.length, data: products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();
    res.json({ success: true, count: products.length, data: products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
