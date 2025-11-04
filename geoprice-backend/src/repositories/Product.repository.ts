import { ProductModel, type IProduct } from '../models/Product.model.js';

export class ProductRepository {
  /**
   * Retrieve all products from the database
   * @returns Promise resolving to array of all products
   */
  async findAll(): Promise<IProduct[]> {
    return await ProductModel.find().exec();
  }

  /**
   * Find a product by its ID
   * @param id - Product ID as string
   * @returns Promise resolving to product or null if not found
   */
  async findById(id: string): Promise<IProduct | null> {
    return await ProductModel.findById(id).exec();
  }

  /**
   * Create a new product
   * @param productData - Partial product data
   * @returns Promise resolving to created product
   */
  async create(productData: Partial<IProduct>): Promise<IProduct> {
    const product = new ProductModel(productData);
    return await product.save();
  }
}
