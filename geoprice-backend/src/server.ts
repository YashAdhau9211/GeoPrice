import { app } from './app.js';
import { config, validateEnvironment } from './config/environment.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

// Validate environment variables on startup
validateEnvironment();

// Start server function
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Express server
    const server = app.listen(config.PORT, () => {
      logger.info(`Server started successfully`, {
        port: config.PORT,
        environment: config.NODE_ENV,
        baseUrl: config.BASE_URL,
      });
      console.log(`🚀 Server running on port ${config.PORT}`);
      console.log(`📍 Environment: ${config.NODE_ENV}`);
      console.log(`🔗 Base URL: ${config.BASE_URL}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received, starting graceful shutdown`);
      console.log(`\n${signal} received, shutting down gracefully...`);

      // Close server to stop accepting new connections
      server.close(async () => {
        logger.info('HTTP server closed');
        console.log('✅ HTTP server closed');

        try {
          // Disconnect from MongoDB
          await disconnectDatabase();
          logger.info('Graceful shutdown completed');
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown', error as Error);
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds if graceful shutdown fails
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught exception', error);
      console.error('❌ Uncaught exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled rejection', reason as Error);
      console.error('❌ Unhandled rejection:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });
  } catch (error) {
    logger.error('Failed to start server', error as Error);
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
