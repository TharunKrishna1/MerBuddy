"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 MERBUDDY REST API BACKEND RUNNING ON PORT ${PORT}`);
    console.log(`- Health Check: http://localhost:${PORT}/api/health`);
    console.log(`- Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Missing ❌'}`);
    console.log(`- Store Mode: ${process.env.MOCK_STORE !== 'false' ? 'MOCK STORE (Demo)' : 'Shopify GraphQL Admin API'}`);
    console.log(`==================================================`);
});
