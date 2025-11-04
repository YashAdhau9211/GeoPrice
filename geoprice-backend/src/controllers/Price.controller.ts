import type { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/Product.service.js';
import { CurrencyService } from '../services/Currency.service.js';
import { successResponse } from '../utils/responseFormatter.js';
import { ValidationError } from '../utils/errors.js';
import type { GetRatesQuery, GetPriceRequest } from '../types/api.types.js';

export class PriceController {
  constructor(
    private productService: ProductService,
    private currencyService: CurrencyService
  ) {}

  /**
   * Get exchange rates
   * GET /api/rates?base=USD&targets=INR,GBP
   * @param req - Express request with query params
   * @param res - Express response
   * @param next - Express next function
   */
  async getRates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { base, targets } = req.query as unknown as GetRatesQuery;

      if (!base || !targets) {
        throw new ValidationError('Base currency and target currencies are required');
      }

      // Parse targets string into array
      const targetArray = targets.split(',').map(t => t.trim());

      if (targetArray.length === 0) {
        throw new ValidationError('At least one target currency is required');
      }

      const rates = await this.currencyService.getExchangeRates(base, targetArray);
      
      res.json(successResponse({ base, rates }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get localized prices for all products
   * POST /api/price
   * Body: { country: string }
   * @param req - Express request with country in body
   * @param res - Express response
   * @param next - Express next function
   */
  async getLocalizedPrices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { country } = req.body as GetPriceRequest;

      if (!country) {
        throw new ValidationError('Country code is required');
      }

      // Get currency for the country
      const currency = this.currencyService.getCurrencyForCountry(country);

      // Get all products
      const products = await this.productService.getAllProducts();

      // Convert prices for each product
      const localizedProducts = await Promise.all(
        products.map(async (product) => {
          const localizedPrice = await this.currencyService.convertPrice(
            product.basePrice,
            'USD',
            currency
          );

          return {
            ...product.toObject(),
            localizedPrice,
            currency,
          };
        })
      );

      res.json(successResponse({
        country,
        currency,
        products: localizedProducts,
      }));
    } catch (error) {
      next(error);
    }
  }
}
