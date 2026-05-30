# User CRUD API

A modern RESTful API for user management built with cutting-edge Node.js technologies.

## 🚀 Technology Stack

- **Node.js** v20+ (Latest LTS)
- **Express.js** 4.x - Web framework
- **Prisma** v6 - Modern ORM
- **SQLite** - Lightweight database
- **Zod** - Schema validation
- **Swagger** - API documentation
- **Winston** - Logging
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting

## 📋 Features

- ✅ Full CRUD operations for users
- ✅ Input validation with Zod
- ✅ Pagination & search
- ✅ Swagger API documentation
- ✅ Request logging with Winston
- ✅ Error handling middleware
- ✅ Security headers (Helmet)
- ✅ CORS enabled
- ✅ Rate limiting
- ✅ Postman collection included

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd crud-app

### 2. Install dependencies
npm install

### 3. Set up environment variables
Create a .env file:
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development

### 4. Run database migrations
npx prisma migrate dev --name init

### 5. Seed the database (optional)
npm run seed

### 6. Start the server
# Development mode
npm run dev

# Production mode
npm start

📚 API Endpoints
Method	Endpoint	                Description
GET	    /health	                    Health check
GET	    /api/users	                Get all users (paginated)
GET	    /api/users/:id	            Get user by ID
POST	/api/users	                Create new user
PUT	    /api/users/:id	            Update user
DELETE	/api/users/:id	            Delete user
GET	    /api/users/stats/summary	Get user statistics

📖 API Documentation
Once the server is running, access interactive documentation at:

Swagger UI: http://localhost:3000/api-docs

Swagger JSON: http://localhost:3000/api-docs.json

🧪 Testing
Run automated tests

# CRUD operations test
node test-crud.js

# Validation test
node test-validation.js

# Final comprehensive test
node final-test.js

Postman Collection
Import postman_collection.json and postman_environment.json into Postman to test all endpoints.

🔒 Environment Variables
Variable	    Description	                            Default
DATABASE_URL	SQLite database path	                file:./dev.db
PORT	        Server port	                            3000
NODE_ENV	    Environment (development/production)	development

📊 Validation Rules
User Creation/Update:
Email: Valid email format, unique, max 255 chars

Name: 2-100 chars, letters/spaces/apostrophes/hyphens only

Age: 0-150 years, integer

🚦 Rate Limiting
General: 100 requests per 15 minutes per IP

Strict: 20 requests per hour per IP (for sensitive ops)

📝 Logging
Logs are stored in:

logs/combined.log - All logs

logs/error.log - Error logs only

🗄️ Database Schema
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  age       Int
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
}

🎯 Example Requests
Create User

curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "age": 30
  }'

Update User

curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "age": 31
  }'

📄 License
MIT

👨‍💻 Author
Jesús David Limón Hernández

🙏 Acknowledgments
Express.js team

Prisma team

OpenAPI/Swagger community