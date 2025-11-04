# GeoPrice - Localized E-Commerce Platform

A full-stack e-commerce application with geo-based pricing and currency conversion.

## Features

- 🌍 Automatic geo-location based pricing
- 💱 Real-time currency conversion (USD, GBP, INR)
- 💳 Stripe payment integration
- 🛒 Product catalog management
- 📦 Order tracking system

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Stripe API
- Exchange Rate API

## Project Structure

```
geoprice/
├── geoprice-frontend/    # Next.js frontend application
└── geoprice-backend/     # Express backend API
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Stripe account
- Exchange Rate API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd geoprice-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (use `.env.example` as template):
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
FRONTEND_URL=http://localhost:3000
```

4. Build and start:
```bash
npm run build
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd geoprice-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/price` - Calculate price for customer location
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/webhook` - Stripe webhook handler

## License

MIT
