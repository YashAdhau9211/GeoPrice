import { Router } from 'express';
import { ProductController } from '../controllers/Product.controller.js';
import { ProductService } from '../services/Product.service.js';
import { ProductRepository } from '../repositories/Product.repository.js';

// Initialize dependencies
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Create router
export const productRouter = Router();

productRouter.get('/products', (req, res, next) => {
  productController.getProducts(req, res, next);
});
