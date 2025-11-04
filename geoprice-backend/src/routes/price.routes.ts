import { Router } from 'express';
import { PriceController } from '../controllers/Price.controller.js';
import { ProductService } from '../services/Product.service.js';
import { CurrencyService } from '../services/Currency.service.js';
import { ProductRepository } from '../repositories/Product.repository.js';

// Initialize dependencies
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const currencyService = new CurrencyService();
const priceController = new PriceController(productService, currencyService);

// Create router
export const priceRouter = Router();

priceRouter.get('/rates', (req, res, next) => {
  priceController.getRates(req, res, next);
});

priceRouter.post('/price', (req, res, next) => {
  priceController.getLocalizedPrices(req, res, next);
});
