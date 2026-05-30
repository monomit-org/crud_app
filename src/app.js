import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { httpLogger } from './middleware/logger.js';

// Import routes (will create in Step 6)
import userRoutes from './routes/userRoutes.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// ============== SECURITY MIDDLEWARE ==============

// Helmet.js - Security headers (Protects against well-known web vulnerabilities)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  }
}));

// CORS - Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// ============== REQUEST PARSING ==============

// JSON parser with size limit
app.use(express.json({ limit: '10mb' }));

// URL encoded parser
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// ============== PERFORMANCE ==============

// Compression - gzip compression for responses
app.use(compression());

// ============== RATE LIMITING ==============

// General rate limiter for all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(generalLimiter);

// Stricter rate limiter for sensitive operations
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 requests per hour
  message: 'Too many requests, please try again after an hour.',
});

// ============== LOGGING ==============

// Morgan HTTP request logger (development format)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Custom Winston logger for HTTP requests
app.use(httpLogger);

// ============== HEALTH CHECK ==============

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CRUD API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      docs: '/api-docs',
      health: '/health'
    }
  });
});

// ============== API ROUTES ==============

// Mount user routes
app.use('/api/users', userRoutes);

// ============== 404 HANDLER ==============

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ============== GLOBAL ERROR HANDLER ==============

// Must be the last middleware
app.use(errorHandler);

export default app;