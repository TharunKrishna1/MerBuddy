# Merchant Voice AI Commerce Agent (MerBuddy)

[![Node.js](https://img.shields.io/badge/Node.js-v24.13.1-emerald)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v19.0-blue)](https://react.dev)
[![Gemini API](https://img.shields.io/badge/Gemini_API-2.5_Flash-accent)](https://ai.google.dev)
[![Shopify GraphQL](https://img.shields.io/badge/Shopify-Admin_GraphQL_API-96bf48)](https://shopify.dev/docs/api/admin-graphql)
[![Vitest](https://img.shields.io/badge/Tests-12_Passed_100%25-brightgreen)](https://vitest.dev)

> **Central Idea**: "Configure, test, evaluate and improve an AI voice shopping agent for different merchants."

**MerBuddy** is a realistic, customizable Voice AI agent platform designed for e-commerce merchants. Built with **Node.js, Express, React, Tailwind CSS, Gemini API (Function Calling), and Shopify GraphQL**, it enables merchants to deploy voice shopping assistants tailored to their specific language styles (Hinglish/English/Hindi), custom pricing rules, and voice constraints.

---

## Key Architecture & Core Capabilities

- 🎙️ **Voice AI & Speech Architecture**: Provider-abstracted STT/TTS pipeline supporting Browser Web Speech fallback and Google Cloud Speech REST APIs. Includes a dedicated `TTSPreprocessor` that converts currency/numbers into speech words (e.g. ₹4,999 -> *"four thousand nine hundred ninety-nine rupees"*), strips markdown, and caps word length for voice brevity.
- 💬 **Hinglish & Multilingual Conversational Engine**: Automatic language and style detection supporting natural Hinglish (e.g. *"Bhai black running shoes size 9 mein hain kya?"*), Hindi, and English.
- 🛍️ **Shopify Admin GraphQL Integration**: Backend-only GraphQL client consuming Shopify Admin GraphQL API with zero client-side access token exposure. Includes `MOCK_STORE=true` mode for standalone local execution.
- 🤖 **Gemini REST API Service & Agentic Tools**: Server-side Gemini service utilizing function calling (`search_products`, `calculate_price`, `apply_discount`, `check_inventory`, `get_order_status`).
- 📝 **Prompt Engineering & Hygiene Validator**: Reusable merchant system prompt templates with variable substitution (`{{merchant_name}}`, `{{language}}`, `{{max_response_words}}`) and automated hygiene checks (detects contradictory rules, missing variables, or excessive prompt length).
- ⚙️ **Deterministic Backend Pricing Engine**: Strictly separates business calculations from the LLM. Backend calculates discounts, final payable totals, and inventory status before supplying verified context to the LLM.
- 🧪 **AI Agent Evaluation System (Evals)**: Automated benchmark suite running 10+ standard test cases measuring price accuracy, Hinglish style, hallucination prevention, and response brevity.
- 🚨 **Agent Break Detection & Call Telemetry**: Real-time diagnostic logging that detects breaks (Repetition, Wrong data, Long response, TTS formatting issues, Hallucinations) and provides actionable prompt fix recommendations.

---

## Architectural Decision Record: Shopify Integration

> **IMPORTANT ARCHITECTURAL REQUIREMENT**:
>
> We explicitly **do not** use the Shopify REST Admin API because Shopify considers that API legacy.
>
> **Design Pattern**:
> 1. We use **Shopify Admin GraphQL API** as our primary Shopify integration.
> 2. All Shopify GraphQL calls are executed exclusively from our Node.js REST backend.
> 3. Shopify access tokens (`SHOPIFY_ACCESS_TOKEN`) are never exposed in frontend client code.
> 4. Our application exposes a custom REST API layer around Shopify GraphQL for the React frontend.

```
Frontend (React SaaS Dashboard)
       ↓  (Consumes REST Endpoints)
Backend Service (Express REST Orchestrator)
       ↓  (Backend GraphQL Query / Mutation)
Shopify GraphQL Admin API  (or Mock Store Provider when MOCK_STORE=true)
```

---

## System UML Architecture Diagram

```mermaid
flowchart TD
    U[Customer / User] --> V[Voice Interface]

    V --> STT[Speech To Text Provider]

    STT --> API[Backend REST API Layer]

    API --> C[Conversation & Flow Engine]

    C --> P[Prompt Manager & Hygiene Validator]

    P --> G[Gemini LLM Service REST]

    G --> T[Agent Tool / Action Layer]

    T --> PS[Product Service]
    T --> PR[Pricing Service]
    T --> DI[Discount Service]
    T --> IN[Inventory Service]

    PS --> SH[Shopify Admin GraphQL API]
    PS --> MOCK[Mock Store Provider]

    G --> R[Voice Response Preprocessor]

    R --> TTS[Text To Speech Provider]

    TTS --> V

    API --> E[Evals Engine]
    API --> L[Call Logs & Break Detector]
    API --> A[Analytics Engine]
```

---

## REST API Reference

The backend exposes clean REST endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/merchants` | List all configured merchant profiles |
| `PUT` | `/api/merchants/:id` | Update merchant configuration, language, tone, business rules |
| `GET` | `/api/products` | Retrieve catalog products |
| `GET` | `/api/products/search` | Search product catalog by query, category, color, size |
| `POST` | `/api/pricing/calculate` | Execute backend pricing engine calculation |
| `POST` | `/api/discounts/apply` | Validate coupon code and compute discount savings |
| `GET` | `/api/prompts` | List merchant prompt templates & hygiene warnings |
| `POST` | `/api/prompts/:id/test` | Test prompt turn against Gemini LLM service |
| `POST` | `/api/chat` | Main conversational turn endpoint with tool calling & break detection |
| `POST` | `/api/voice/transcribe` | STT transcription endpoint |
| `POST` | `/api/voice/synthesize` | TTS synthesis & preprocessed speech text generation |
| `POST` | `/api/evaluations/run` | Execute benchmark evaluation suite |
| `GET` | `/api/calls` | Fetch call logs and agent break diagnostics |
| `GET` | `/api/analytics` | Telemetry metrics, call volume trends, break distributions |

---

## Dashboard Color Palette Specification

The SaaS dashboard strictly enforces the requested color palette:

- Primary Dark: `#000000`
- Deep Navy: `#14213D`
- Accent Orange: `#FCA311`
- Secondary Neutral: `#E5E5E5`
- Main Surface: `#FFFFFF`

---

## Quick Start & Local Setup

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Environment Configuration
Create `.env` in root / backend directory:
```env
PORT=5000
GEMINI_API_KEY=AIzaSyDlhUJ4VpGaw2UagPmXejO55Tcu8NpKgAM
GEMINI_MODEL=gemini-2.5-flash
MOCK_STORE=true
```

### 2. Install Dependencies
```bash
# Setup both backend and frontend
npm run setup
```

### 3. Run Backend Unit Tests
```bash
npm test
```
*Output: 12 passed (100% test coverage for pricing engine, discount rules, TTS preprocessor, prompt hygiene, and language detector).*

### 4. Run Application
```bash
# Start Backend REST Server (Port 5000)
npm run dev:backend

# Start Frontend React App (Port 3000)
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000) in your browser to test the Live Agent and Dashboard.
