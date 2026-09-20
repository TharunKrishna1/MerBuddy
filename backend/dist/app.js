"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const merchantRoutes_1 = __importDefault(require("./routes/merchantRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const pricingRoutes_1 = __importDefault(require("./routes/pricingRoutes"));
const promptRoutes_1 = __importDefault(require("./routes/promptRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const voiceRoutes_1 = __importDefault(require("./routes/voiceRoutes"));
const evalRoutes_1 = __importDefault(require("./routes/evalRoutes"));
const callRoutes_1 = __importDefault(require("./routes/callRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
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
app.use('/api/merchants', merchantRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/pricing', pricingRoutes_1.default);
app.use('/api/discounts', pricingRoutes_1.default); // Alias for POST /api/discounts/apply
app.use('/api/prompts', promptRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
app.use('/api/voice', voiceRoutes_1.default);
app.use('/api/evaluations', evalRoutes_1.default);
app.use('/api/calls', callRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});
exports.default = app;
