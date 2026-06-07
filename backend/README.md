# Backend README
# Notes App - Backend API

## Overview
Node.js/Express backend for the Notes App with PostgreSQL database, Pino logging, error handling, and comprehensive testing.

## Tech Stack
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.5.3
- **Database**: PostgreSQL with Node.js pg driver
- **Logging**: Pino Logger 8.17.2
- **Testing**: Mocha 10.2.0 + Chai 4.3.10
- **Code Quality**: ESLint + TypeScript
- **Real-time**: Socket.IO 4.7.2

## Project Structure
```
backend/
├── src/
│   ├── config/          # Configuration files (logger, database)
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware (auth, logging, error)
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── index.ts          # Express server entry point
├── tests/                # Test files (Mocha/Chai)
├── src/migrations/       # Database migrations
├── .env.example          # Environment variables template
├── package.json
├── tsconfig.json
└── eslint.config.js
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
NODE_ENV=development
PORT=3001
LOG_LEVEL=info
DB_HOST=localhost
DB_PORT=5432
DB_NAME=notes_app
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

### 3. Setup PostgreSQL Database
```bash
# Create database
createdb notes_app

# Run migrations
psql notes_app < src/migrations/001_create_schema.sql
```

### 4. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:3001`

## Available Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build           # Build TypeScript to JavaScript
npm start               # Start production server

# Testing
npm test                # Run tests once
npm run test:watch      # Run tests in watch mode

# Code Quality
npm run lint            # Check code for issues
npm run lint:fix        # Auto-fix code issues
npm run sonarqube       # Run SonarQube analysis
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Notes API (Requires Authentication)
- `POST /api/notes` - Create note
- `GET /api/notes` - List all notes (with search & pagination)
- `GET /api/notes/:id` - Get single note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/export/:format` - Export notes (json/csv)

### Users API
- `POST /api/users` - Create/get user
- `GET /api/users/profile` - Get current user (requires auth)
- `PUT /api/users/profile` - Update user (requires auth)

## Authentication
Use JWT Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

## Logging
Logs are output to console with:
- Request/response logging
- Error logging with stack traces
- Activity logging (note creation, updates, deletions)

View logs:
```bash
npm run dev  # Pretty-formatted logs in development
```

## Testing
Tests use Mocha + Chai with Sinon for mocking:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/services/NoteService.test.ts
```

Test coverage includes:
- Service layer (NoteService, UserService)
- Controller functions
- Error handling
- Database operations
- Validation logic

## Database Schema

### Users Table
```sql
id (UUID, Primary Key)
email (VARCHAR, Unique)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Notes Table
```sql
id (UUID, Primary Key)
user_id (UUID, Foreign Key)
title (VARCHAR)
content (TEXT)
search_vector (tsvector)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## Error Handling
Consistent error responses with structure:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

## Performance Features
- Database indexes on frequently queried columns
- Pagination support for large datasets
- Full-text search support on notes
- Request/response logging for monitoring

## Code Quality
- TypeScript strict mode enabled
- ESLint rules for consistent code
- Unit tests for critical functions
- Error handling and validation

## Future Enhancements
- [ ] Socket.IO for real-time updates
- [ ] Rate limiting
- [ ] Database connection pooling optimization
- [ ] Caching layer (Redis)
- [ ] API versioning
- [ ] OpenAPI/Swagger documentation
- [ ] Load balancing configuration

## Contributing
Follow the 10P SHINE branching strategy:
- Feature branches: `feature/backend/<feature-name>`
- Bugfix branches: `bugfix/backend/<bug-description>`
- Merge to develop branch for integration

## Support
For issues or questions, please check the project documentation or contact the development team.
