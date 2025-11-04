import express, { type Application } from 'express';
import cors from 'cors';
import { config } from './config/environment.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { productRouter } from './routes/product.routes.js';
import { priceRouter } from './routes/price.routes.js';
import { checkoutRouter } from './routes/checkout.routes.js';
import { webhookRouter } from './routes/webhook.routes.js';

// Create Express application
export const app: Application = express();

// CORS configuration - restrict to authorized frontend origin
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  })
);

// Request logging middleware
app.use(requestLogger);

// Body parsing middleware (JSON) - applied to all routes except webhook
// Note: Webhook route uses raw body parser, so it's handled separately in webhook.routes.ts
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// Mount API routes
app.use('/api', productRouter);
app.use('/api', priceRouter);
app.use('/api', checkoutRouter);
app.use('/api', webhookRouter);

// Global error handler - must be last
app.use(errorHandler);
