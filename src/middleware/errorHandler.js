import { logger } from './logger.js';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message, isOperational } = err;
  
  // Log error
  if (statusCode >= 500) {
    logger.error(`Error: ${message}`, {
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      body: req.body,
      params: req.params,
      query: req.query
    });
  } else {
    logger.warn(`Warning: ${message}`, {
      url: req.originalUrl,
      method: req.method,
      statusCode
    });
  }
  
  // Send response
  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Async wrapper to avoid try-catch blocks
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};