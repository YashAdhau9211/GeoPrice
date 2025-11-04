import type { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/Product.service.js';
import { PaymentService } from '../services/Payment.service.js';
import { CurrencyService } from '../services/Currency.service.js';
import { successResponse } from '../utils/responseFormatter.js';
import { ValidationError } from '../utils/errors.js';
import type { CreateCheckoutRequest } from '../types/api.types.js';

const SUPPORTED_CURRENCIES = ['USD', 'INR', 'GBP'];

export class CheckoutController {
  constructor(
    private productService: ProductService,
    private paymentService: PaymentService,
    private currencyService: CurrencyService
  ) {}

  /**
   * Create a Stripe checkout session
   * POST /api/create-checkout-session
   * Body: { productId: string, currency: string, country: string }
   * @param req - Express request with checkout data in body
   * @param res - Express response
   * @param next - Express next function
   */
  async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, currency, country } = req.body as CreateCheckoutRequest;

      // Validate required fields
      if (!productId) {
        throw new ValidationError('Product ID is required');
      }

      if (!currency) {
        throw new ValidationError('Currency is required');
      }

      if (!country) {
        throw new ValidationError('Country is required');
      }

      // Validate currency is supported
      if (!SUPPORTED_CURRENCIES.includes(currency.toUpperCase())) {
        throw new ValidationError(
          `Currency must be one of: ${SUPPORTED_CURRENCIES.join(', ')}`
        );
      }

      // Get product (will throw NotFoundError if doesn't exist)
      const product = await this.productService.getProductById(productId);

      // Convert product price to requested currency
      const convertedPrice = await this.currencyService.convertPrice(
        product.basePrice,
        'USD',
        currency.toUpperCase()
      );

      // Create a modified product object with converted price
      // Use toObject() with getters to preserve _id properly
      const productObj = product.toObject({ getters: true });
      const productWithConvertedPrice = {
        ...productObj,
        basePrice: convertedPrice,
        _id: product._id, // Explicitly ensure _id is preserved
      };

      // Create Stripe checkout session
      const { sessionId, sessionUrl } = await this.paymentService.createCheckoutSession(
        productWithConvertedPrice as any,
        currency.toUpperCase(),
        country
      );

      res.json(successResponse({
        sessionId,
        sessionUrl,
      }));
    } catch (error) {
      next(error);
    }
  }
}
