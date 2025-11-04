import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { ProductModel } from '../models/Product.model.js';
import { logger } from '../utils/logger.js';

interface SeedProduct {
  name: string;
  description: string;
  basePrice: number;
  sku: string;
  images: string[];
}

const sampleProducts: SeedProduct[] = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality. Perfect for music lovers and professionals.',
    basePrice: 149.99,
    sku: 'WBH-001',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    ],
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 50+ sport modes. Water-resistant up to 50 meters.',
    basePrice: 249.99,
    sku: 'SFW-002',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
    ],
  },
  {
    name: 'Portable Power Bank 20000mAh',
    description: 'High-capacity portable charger with fast charging technology. Charge multiple devices simultaneously with dual USB ports and USB-C.',
    basePrice: 59.99,
    sku: 'PPB-003',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800',
      'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800',
    ],
  },
];

const seedProducts = async (): Promise<void> => {
  try {
    logger.info('Starting product seeding process...');

    // Connect to database
    await connectDatabase();

    let insertedCount = 0;
    let skippedCount = 0;

    for (const productData of sampleProducts) {
      // Check if product already exists by SKU (idempotent)
      const existingProduct = await ProductModel.findOne({ sku: productData.sku });

      if (existingProduct) {
        logger.info(`Product with SKU ${productData.sku} already exists. Skipping...`);
        skippedCount++;
        continue;
      }

      // Insert new product
      const product = await ProductModel.create(productData);
      logger.info(`Successfully inserted product: ${product.name} (SKU: ${product.sku})`);
      insertedCount++;
    }

    logger.info(`Seeding complete! Inserted: ${insertedCount}, Skipped: ${skippedCount}`);

    // Disconnect from database
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding products:', error as Error);
    await disconnectDatabase();
    process.exit(1);
  }
};

// Run the seeding script
seedProducts();
