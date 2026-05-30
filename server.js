import dotenv from 'dotenv';
import app from './src/app.js';
import { logger } from './src/middleware/logger.js';
import prisma from './src/utils/prisma.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Function to start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
    
    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`
      🚀 Server is running!
      📡 Environment: ${NODE_ENV}
      🔗 URL: http://localhost:${PORT}
      📚 API Documentation: http://localhost:${PORT}/api-docs
      ❤️  Health Check: http://localhost:${PORT}/health
      `);
    });
    
    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await prisma.$disconnect();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during database disconnection:', error);
          process.exit(1);
        }
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };
    
    // Handle shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();