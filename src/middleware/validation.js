import { z } from 'zod';

// ==================== USER SCHEMAS ====================

// Schema for creating a new user
export const createUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must be less than 255 characters')
    .transform((val) => val.toLowerCase().trim()),
  
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, apostrophes, and hyphens')
    .transform((val) => val.trim()),
  
  age: z
    .number()
    .int('Age must be an integer')
    .min(0, 'Age cannot be negative')
    .max(150, 'Age cannot exceed 150 years')
    .optional()
    .default(18),
});

// Schema for updating an existing user (all fields optional)
export const updateUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must be less than 255 characters')
    .transform((val) => val.toLowerCase().trim())
    .optional(),
  
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, apostrophes, and hyphens')
    .transform((val) => val.trim())
    .optional(),
  
  age: z
    .number()
    .int('Age must be an integer')
    .min(0, 'Age cannot be negative')
    .max(150, 'Age cannot exceed 150 years')
    .optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

// Schema for user ID parameter
export const userIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a number')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, 'ID must be a positive integer'),
});

// Schema for query parameters (pagination, filtering)
export const userQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, 'Page must be at least 1')
    .optional()
    .default('1'),
  
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default('10'),
  
  search: z
    .string()
    .min(1, 'Search term must not be empty')
    .optional(),
});

// ==================== VALIDATION MIDDLEWARE ====================

// Generic validation middleware factory
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      let dataToValidate;
      
      // Choose validation source (body, params, query)
      switch (source) {
        case 'params':
          dataToValidate = req.params;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        case 'body':
        default:
          dataToValidate = req.body;
      }
      
      // Validate and parse the data
      const validatedData = schema.parse(dataToValidate);
      
      // Attach validated data back to request
      if (source === 'params') {
        req.params = validatedData;
      } else if (source === 'query') {
        req.query = validatedData;
      } else {
        req.body = validatedData;
      }
      
      next();
    } catch (error) {
      // Format Zod errors for response
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: formattedErrors,
          timestamp: new Date().toISOString()
        });
      }
      
      next(error);
    }
  };
};

// ==================== SPECIFIC VALIDATION MIDDLEWARES ====================

// Pre-configured validators for common use cases
export const validateCreateUser = validate(createUserSchema, 'body');
export const validateUpdateUser = validate(updateUserSchema, 'body');
export const validateUserId = validate(userIdSchema, 'params');
export const validateUserQuery = validate(userQuerySchema, 'query');

// ==================== CUSTOM VALIDATION FUNCTIONS ====================

// Validate email format without middleware
export const isValidEmail = (email) => {
  const emailSchema = z.string().email();
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

// Validate age range
export const isValidAge = (age) => {
  const ageSchema = z.number().int().min(0).max(150);
  try {
    ageSchema.parse(age);
    return true;
  } catch {
    return false;
  }
};

// Sanitize input (remove extra spaces, special characters)
export const sanitizeString = (input) => {
  if (!input) return input;
  return input.trim().replace(/[<>]/g, ''); // Remove HTML tags
};

// Email normalization
export const normalizeEmail = (email) => {
  if (!email) return email;
  return email.toLowerCase().trim();
};