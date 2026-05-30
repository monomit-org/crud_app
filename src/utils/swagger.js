import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User CRUD API Documentation',
      version: '1.0.0',
      description: 'A modern RESTful API for managing users with Node.js, Express, Prisma, and SQLite',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        // User schema
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
              example: 1,
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com',
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
            },
            age: {
              type: 'integer',
              description: 'User age',
              minimum: 0,
              maximum: 150,
              example: 28,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2024-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        // Create User Input
        CreateUserInput: {
          type: 'object',
          required: ['email', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address (unique)',
              example: 'john.doe@example.com',
            },
            name: {
              type: 'string',
              description: 'User full name',
              minLength: 2,
              maxLength: 100,
              example: 'John Doe',
            },
            age: {
              type: 'integer',
              description: 'User age',
              minimum: 0,
              maximum: 150,
              default: 18,
              example: 28,
            },
          },
        },
        // Update User Input
        UpdateUserInput: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address (unique)',
              example: 'john.updated@example.com',
            },
            name: {
              type: 'string',
              description: 'User full name',
              minLength: 2,
              maxLength: 100,
              example: 'John Updated',
            },
            age: {
              type: 'integer',
              description: 'User age',
              minimum: 0,
              maximum: 150,
              example: 30,
            },
          },
        },
        // Error Response
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Validation failed',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email',
                  },
                  message: {
                    type: 'string',
                    example: 'Invalid email format',
                  },
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        // Success Response
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'User created successfully',
            },
            data: {
              type: 'object',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        // Pagination
        Pagination: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'integer',
              example: 1,
            },
            totalPages: {
              type: 'integer',
              example: 5,
            },
            totalItems: {
              type: 'integer',
              example: 45,
            },
            itemsPerPage: {
              type: 'integer',
              example: 10,
            },
            hasNextPage: {
              type: 'boolean',
              example: true,
            },
            hasPrevPage: {
              type: 'boolean',
              example: false,
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request - Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        NotFound: {
          description: 'Not Found - Resource does not exist',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        Conflict: {
          description: 'Conflict - Resource already exists',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes files
};

export const swaggerSpec = swaggerJsdoc(options);