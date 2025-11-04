import { ProductRepository } from '../repositories/Product.repository.js';
import type { IProduct } from '../models/Product.model.js';
import { NotFoundError } from '../utils/errors.js';

export class ProductService {
  constructor(private productRepo: ProductRepository) {}

  async getAllProducts(): Promise<IProduct[]> {
    return await this.productRepo.findAll();
  }

  /**
   * Get a single product by ID
   * @param id - Product ID as string
   * @returns Promise resolving to product
   * @throws NotFoundError if product doesn't exist
   */
  async getProductById(id: string): Promise<IProduct> {
    const product = await this.productRepo.findById(id);
    
    if (!product) {
      throw new NotFoundError('Product');
    }
    
    return product;
  }
}
