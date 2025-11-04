import { Router } from 'express';
import { CheckoutController } from '../controllers/Checkout.controller.js';
import { ProductService } from '../services/Product.service.js';
import { PaymentService } from '../services/Payment.service.js';
import { CurrencyService } from '../services/Currency.service.js';
import { OrderService } from '../services/Order.service.js';
import { ProductRepository } from '../repositories/Product.repository.js';
import { OrderRepository } from '../repositories/Order.repository.js';
import { stripeClient } from '../config/stripe.js';
import { validateCheckoutRequest } from '../middleware/validateRequest.js';

// Initialize dependencies
const productRepository = new ProductRepository();
const orderRepository = new OrderRepository();
const productService = new ProductService(productRepository);
const currencyService = new CurrencyService();
const paymentService = new PaymentService(stripeClient, orderRepository);
const checkoutController = new CheckoutController(
  productService,
  paymentService,
  currencyService
);

// Create router
export const checkoutRouter = Router();

/**
 * POST /api/create-checkout-session
 * Create a Stripe checkout session
 * Body: { productId: string, currency: string, country: string }
 */
checkoutRouter.post(
  '/create-checkout-session',
  validateCheckoutRequest,
  (req, res, next) => {
    checkoutController.createSession(req, res, next);
  }
);
