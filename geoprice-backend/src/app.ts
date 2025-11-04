import express, { type Application } from 'express';
import cors from 'cors';
import { config } from './config/environment.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { productRouter } from './routes/product.routes.js';
import { priceRouter } from './routes/price.routes.js';
import { checkoutRouter } from './routes/checkout.routes.js';
import { webhookRouter } from './routes/webhook.routes.js';

export const app: Application = express();

// Clean FRONTEND_URL to remove any quotes, brackets, or invalid characters
let frontendUrl = config.FRONTEND_URL || '';

console.log('FRONTEND_URL raw value:', JSON.stringify(frontendUrl));

// Remove all quotes (single and double), brackets, and whitespace
frontendUrl = frontendUrl
  .replace(/[\[\]"']/g, '') // Remove brackets and quotes
  .trim(); // Remove whitespace

console.log('FRONTEND_URL after cleaning:', frontendUrl);

// Configure CORS with flexible origin matching
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // Clean the frontend URL for comparison
    const cleanFrontendUrl = frontendUrl.replace(/\/$/, ''); // Remove trailing slash
    const cleanOrigin = origin.replace(/\/$/, ''); // Remove trailing slash from origin

    console.log('CORS check - Origin:', origin, 'Allowed:', cleanFrontendUrl);

    // Allow if:
    // 1. Wildcard is set
    // 2. Origin matches the production frontend URL
    // 3. Origin is a Vercel preview deployment (*.vercel.app)
    const isVercelPreview = origin.includes('.vercel.app');
    const isProductionFrontend = cleanOrigin === cleanFrontendUrl;
    
    if (frontendUrl === '*' || isProductionFrontend || isVercelPreview) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(null, false); // Don't throw error, just deny
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

app.use('/api', webhookRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', productRouter);
app.use('/api', priceRouter);
app.use('/api', checkoutRouter);

app.use(errorHandler);
