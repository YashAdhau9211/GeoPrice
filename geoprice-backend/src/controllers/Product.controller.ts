import type { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/Product.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export class ProductController {
  constructor(private productService: ProductService) {}

  /**
   * Get all products
   * GET /api/products
   * @param req - Express request
   * @param res - Express response
   * @param next - Express next function
   */
  async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      res.json(successResponse(products));
    } catch (error) {
      next(error);
    }
  }
}
