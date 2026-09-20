import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import merchantRoutes from './routes/merchantRoutes';
import productRoutes from './routes/productRoutes';
import pricingRoutes from './routes/pricingRoutes';
import promptRoutes from './routes/promptRoutes';
import chatRoutes from './routes/chatRoutes';
import voiceRoutes from './routes/voiceRoutes';
import evalRoutes from './routes/evalRoutes';
import callRoutes from './routes/callRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env')
];

for (const envPath of envPaths) {
  dotenv.config({ path: envPath });
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Merchant Voice AI Commerce Agent API (MerBuddy)',
    timestamp: new Date().toISOString(),
    mockStore: process.env.MOCK_STORE !== 'false',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// REST API Routers
app.use('/api/merchants', merchantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/discounts', pricingRoutes); // Alias for POST /api/discounts/apply
app.use('/api/prompts', promptRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/evaluations', evalRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

export default app;
