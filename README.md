# GeoPrice - Intelligent Geo-Based E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://geoprice-frontend.vercel.app)
[![Backend API](https://img.shields.io/badge/API-live-blue)](https://geoprice-backend.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A modern, full-stack e-commerce platform that automatically adjusts product pricing based on the user's geographic location, providing a localized shopping experience with real-time currency conversion.

## 🌐 Live Demo

- **Frontend Application**: [https://geoprice-frontend.vercel.app/](https://geoprice-frontend.vercel.app/)
- **Backend API**: [https://geoprice-backend.vercel.app](https://geoprice-backend.vercel.app)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🎯 Overview

GeoPrice is an intelligent e-commerce platform designed to provide a seamless, localized shopping experience for customers worldwide. By leveraging geolocation technology and real-time currency conversion, the platform automatically displays product prices in the user's local currency, eliminating confusion and improving conversion rates.

### Business Value

- **Increased Conversion Rates**: Customers see prices in their familiar currency
- **Global Reach**: Seamlessly serve customers from multiple countries
- **Automated Pricing**: Real-time currency conversion eliminates manual price management
- **Enhanced UX**: Automatic location detection provides instant localization

## ✨ Key Features

### 🌍 Geolocation-Based Pricing
- Automatic detection of user's country and currency
- Real-time currency conversion using live exchange rates
- Support for multiple currencies (USD, GBP, INR, and more)
- Manual country selection for user preference

### 💳 Secure Payment Processing
- Integration with Stripe for secure payment handling
- Support for international payment methods
- Webhook-based order confirmation
- Test mode for development and staging

### 🎨 Modern User Interface
- Responsive design optimized for all devices
- Server-side rendering for optimal performance
- Progressive enhancement for better user experience
- Accessible and SEO-friendly

### 🔒 Enterprise-Grade Security
- CORS protection with configurable origins
- Environment-based configuration
- Secure API key management
- Input validation and sanitization

## 🛠 Technology Stack

### Frontend

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **Next.js 14** | React Framework | Server-side rendering, optimal performance, built-in routing, and excellent developer experience |
| **TypeScript** | Type Safety | Catch errors at compile-time, improved IDE support, better code maintainability |
| **Tailwind CSS** | Styling | Utility-first CSS, rapid development, consistent design system, small bundle size |
| **React Hooks** | State Management | Modern React patterns, cleaner code, better performance optimization |

### Backend

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **Node.js** | Runtime Environment | Non-blocking I/O, excellent for API services, large ecosystem |
| **Express.js** | Web Framework | Lightweight, flexible, extensive middleware support, industry standard |
| **TypeScript** | Type Safety | Enhanced code quality, better refactoring, improved team collaboration |
| **MongoDB** | Database | Flexible schema, horizontal scalability, JSON-like documents, cloud-native |
| **Mongoose** | ODM | Schema validation, middleware support, query building, type safety |

### External Services

| Service | Purpose | Why We Use It |
|---------|---------|---------------|
| **Stripe** | Payment Processing | Industry-leading security, comprehensive API, global payment support |
| **ExchangeRate-API** | Currency Conversion | Real-time rates, reliable uptime, simple integration, free tier available |
| **Vercel** | Hosting & Deployment | Serverless architecture, automatic scaling, edge network, zero-config deployment |

## 🏗 Architecture

### System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Next.js        │────────▶│  Express.js     │────────▶│  MongoDB Atlas  │
│  Frontend       │  HTTPS  │  Backend API    │         │  Database       │
│                 │◀────────│                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │                            
        │                           │                            
        ▼                           ▼                            
┌─────────────────┐         ┌─────────────────┐                
│                 │         │                 │                
│  Vercel Edge    │         │  Stripe API     │                
│  Network        │         │  Payment        │                
│                 │         │                 │                
└─────────────────┘         └─────────────────┘                
```

### Data Flow

1. **User Access**: User visits the frontend application
2. **Geolocation**: System detects user's country via IP geolocation
3. **Currency Mapping**: Country code is mapped to appropriate currency
4. **Price Calculation**: Backend fetches exchange rates and converts prices
5. **Display**: Localized prices are displayed to the user
6. **Checkout**: User initiates checkout with Stripe
7. **Payment**: Stripe processes payment securely
8. **Webhook**: Backend receives payment confirmation
9. **Order Creation**: Order is stored in MongoDB database

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB Atlas account (or local MongoDB instance)
- Stripe account for payment processing
- ExchangeRate-API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GeoPrice
   ```

2. **Install backend dependencies**
   ```bash
   cd geoprice-backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../geoprice-frontend
   npm install
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Seed the database** (optional)
   ```bash
   cd geoprice-backend
   node seed-products.cjs
   ```

### Running Locally

**Backend (Terminal 1)**
```bash
cd geoprice-backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Frontend (Terminal 2)**
```bash
cd geoprice-frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/test?retryWrites=true&w=majority

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Currency Conversion
EXCHANGE_API_KEY=your_exchange_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Obtaining API Keys

**MongoDB Atlas**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string from "Connect" → "Connect your application"
4. Add `/test` database name to the connection string

**Stripe**
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Use test keys for development

**ExchangeRate-API**
1. Sign up at [exchangerate-api.com](https://www.exchangerate-api.com/)
2. Get free API key from dashboard

## 📚 API Documentation

### Base URL
```
Production: https://geoprice-backend.vercel.app
Development: http://localhost:5000
```

### Endpoints

#### Health Check
```http
GET /health
```
Returns server health status.

#### Get Products
```http
GET /api/products
```
Returns all available products with base prices.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Product Name",
      "description": "Product description",
      "basePrice": 99.99,
      "sku": "PROD-001",
      "images": ["url1", "url2"]
    }
  ]
}
```

#### Calculate Localized Prices
```http
POST /api/price
Content-Type: application/json

{
  "country": "US"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "country": "US",
    "currency": "USD",
    "products": [
      {
        "_id": "...",
        "name": "Product Name",
        "basePrice": 99.99,
        "localizedPrice": 99.99,
        "currency": "USD"
      }
    ]
  }
}
```

#### Create Checkout Session
```http
POST /api/create-checkout-session
Content-Type: application/json

{
  "productId": "...",
  "currency": "USD",
  "country": "US"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "sessionUrl": "https://checkout.stripe.com/..."
  }
}
```

## 🚢 Deployment

### Deploying to Vercel

Both frontend and backend are deployed on Vercel's serverless platform.

**Backend Deployment**
```bash
cd geoprice-backend
vercel --prod
```

**Frontend Deployment**
```bash
cd geoprice-frontend
vercel --prod
```

### Environment Variables on Vercel

1. Go to your project on Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add all required environment variables
4. Select appropriate environments (Production, Preview, Development)
5. Redeploy for changes to take effect

### Post-Deployment Configuration

**Stripe Webhook Setup**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://geoprice-backend.vercel.app/api/webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook signing secret
5. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## 🧪 Testing

### Running Tests

**Backend Tests**
```bash
cd geoprice-backend
npm test
```

**Frontend Tests**
```bash
cd geoprice-frontend
npm test
```

### End-to-End Testing

Run the automated E2E test suite:
```bash
node test-complete-e2e.js
```

### Manual Testing Checklist

- [ ] Products load correctly
- [ ] Prices display in local currency
- [ ] Country selector changes currency
- [ ] Checkout redirects to Stripe
- [ ] Payment completes successfully
- [ ] Order is created in database
- [ ] Webhook is received and processed

### Test Payment Cards

Use Stripe test cards for testing:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

## 📁 Project Structure

```
GeoPrice/
├── geoprice-backend/          # Backend API
│   ├── api/                   # Vercel serverless functions
│   │   └── index.ts          # Main API entry point
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Mongoose models
│   │   ├── repositories/     # Data access layer
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── .env                  # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json           # Vercel configuration
│
├── geoprice-frontend/         # Frontend application
│   ├── app/                  # Next.js app directory
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   ├── constants/            # Constants and config
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   ├── public/               # Static assets
│   ├── types/                # TypeScript types
│   ├── .env.local            # Local environment variables
│   ├── next.config.js        # Next.js configuration
│   ├── package.json
│   ├── tailwind.config.ts    # Tailwind configuration
│   └── tsconfig.json
│
|
└── README.md                 # This file
```


## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Stripe](https://stripe.com/) for secure payment processing
- [Vercel](https://vercel.com/) for seamless deployment
- [MongoDB](https://www.mongodb.com/) for flexible data storage
- [ExchangeRate-API](https://www.exchangerate-api.com/) for currency conversion



