import { app } from '../src/app.js';
import { connectDatabase } from '../src/config/database.js';
import { logger } from '../src/utils/logger.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

// Ensure database connection before handling requests
async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Check if mongoose is already connected
    if (mongoose.connection.readyState !== 1) {
      console.log('🔌 Establishing database connection...');
      console.log('Connection state:', mongoose.connection.readyState);
      await connectDatabase();
      console.log('✅ Database connected');
      console.log('New connection state:', mongoose.connection.readyState);
    }

    // Handle the request with Express
    return app(req, res);
  } catch (error) {
    logger.error('Failed to connect to database', error as Error);
    console.error('❌ Failed to connect to database:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Export the handler for Vercel serverless
export default handler;
