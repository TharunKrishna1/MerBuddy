import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 MERBUDDY REST API BACKEND RUNNING ON PORT ${PORT}`);
  console.log(`- Health Check: http://localhost:${PORT}/api/health`);
  console.log(`- Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Missing ❌'}`);
  console.log(`- Store Mode: ${process.env.MOCK_STORE !== 'false' ? 'MOCK STORE (Demo)' : 'Shopify GraphQL Admin API'}`);
  console.log(`==================================================`);
});
