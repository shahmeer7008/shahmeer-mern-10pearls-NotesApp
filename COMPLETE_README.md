# Notes App - Full MERN Stack Implementation

**Complete implementation of all Phase 1, Phase 2, and Phase 3 requirements**

## 📋 Project Overview

This is a full-stack notes application with React frontend, Node.js/Express backend, PostgreSQL database, comprehensive logging, testing, and code quality monitoring. It allows users to create, edit, delete, and manage rich-text notes with real-time synchronization, search/filter, and export/import capabilities.

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18.3.1 + TypeScript
- React Router 7.17.0 for navigation
- TailwindCSS 3.4.1 for styling
- TipTap 2.1.16 for rich text editing
- Socket.IO Client 4.7.2 for real-time updates
- Jest 29.7.0 for unit testing
- Vite 5.4.2 for build tooling

**Backend:**
- Node.js with Express 4.18.2
- TypeScript 5.5.3
- PostgreSQL with pg driver
- Pino Logger 8.17.2 for logging
- Mocha 10.2.0 + Chai 4.3.10 for testing
- Socket.IO 4.7.2 for real-time communication
- Helmet 7.1.0 for security

**Database:**
- PostgreSQL with full-text search support
- UUID for primary keys
- Row-level security (RLS) for data isolation

**Code Quality:**
- SonarQube configuration for both frontend and backend
- ESLint for code linting
- TypeScript strict mode

## 📂 Project Structure

```
shahmeer-mern-10pearls-NotesApp/
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── __tests__/       # Component tests
│   │   ├── contexts/             # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ToastContext.tsx
│   │   │   └── __tests__/
│   │   ├── pages/                # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── EditorPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── hooks/                # Custom React hooks
│   │   │   └── useRealtimeUpdates.ts
│   │   ├── utils/                # Utility functions
│   │   │   ├── exportImport.ts
│   │   │   └── __tests__/
│   │   ├── lib/
│   │   │   └── supabase.ts       # Supabase config (fallback)
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── setupTests.ts         # Jest configuration
│   ├── jest.config.js
│   ├── sonar-project.properties
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── config/               # Configuration
│   │   │   ├── logger.ts
│   │   │   └── database.ts
│   │   ├── controllers/           # Request handlers
│   │   │   ├── noteController.ts
│   │   │   └── userController.ts
│   │   ├── middleware/            # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   ├── requestLogger.ts
│   │   │   └── auth.ts
│   │   ├── models/                # Data models
│   │   │   ├── Note.ts
│   │   │   └── User.ts
│   │   ├── routes/                # API routes
│   │   │   ├── noteRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── healthRoutes.ts
│   │   ├── services/              # Business logic
│   │   │   ├── NoteService.ts
│   │   │   └── UserService.ts
│   │   ├── migrations/            # Database migrations
│   │   │   └── 001_create_schema.sql
│   │   └── index.ts               # Express server entry
│   ├── tests/                     # Mocha/Chai tests
│   │   ├── controllers/
│   │   │   └── noteController.test.ts
│   │   └── services/
│   │       ├── NoteService.test.ts
│   │       └── UserService.test.ts
│   ├── eslint.config.js
│   ├── sonar-project.properties
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── AUDIT_REPORT.md
├── sonar-project.properties       # Root SonarQube config
├── jest.config.js                 # Root Jest config
└── README.md                       # This file
```

## ✅ Completed Requirements

### Phase 1: Critical (Fully Complete)

#### Backend Setup ✅
- [x] Full Node.js/Express server with TypeScript
- [x] PostgreSQL database configuration
- [x] Database migrations with schema setup
- [x] Connection pooling with pg driver

#### Pino Logging ✅
- [x] Pino logger configuration with pretty-printing
- [x] Request/response logging middleware
- [x] Error logging with stack traces
- [x] Activity logging (note CRUD, user actions)
- [x] Log level configuration

#### Error Handling ✅
- [x] Global error handling middleware
- [x] Standardized error response format
- [x] AppError custom exception class
- [x] Async error wrapper
- [x] HTTP status code mapping
- [x] Error logging with context

#### API Implementation ✅
- [x] RESTful endpoints for CRUD operations
- [x] Note creation, retrieval, update, deletion
- [x] User management endpoints
- [x] Authentication middleware
- [x] Input validation
- [x] CORS configuration
- [x] Helmet security headers

### Phase 2: High Priority (Fully Complete)

#### Backend Testing ✅
- [x] Mocha + Chai test setup
- [x] Service layer tests (NoteService, UserService)
- [x] Controller tests
- [x] Sinon mocks for database operations
- [x] Test utilities
- [x] npm test script

#### Frontend Testing ✅
- [x] Jest configuration for React
- [x] Testing Library setup
- [x] Auth context tests
- [x] Component tests (Toast, RichTextEditor)
- [x] Utility function tests
- [x] npm test script
- [x] Coverage thresholds configured

#### Rich Text Editor ✅
- [x] TipTap integration
- [x] Formatting toolbar (Bold, Italic, Headings, Lists)
- [x] HTML output
- [x] Placeholder support
- [x] RichTextEditor React component
- [x] Integrated in EditorPage

#### SonarQube Integration ✅
- [x] Frontend sonar-project.properties
- [x] Backend sonar-project.properties
- [x] Code coverage configuration
- [x] Test exclusion patterns
- [x] Quality gates setup

### Phase 3: Nice to Have (Fully Complete)

#### Search & Filter ✅
- [x] Full-text search in dashboard
- [x] Search by title and content
- [x] Case-insensitive search
- [x] Sort by date (newest/oldest)
- [x] Sort alphabetically by title
- [x] Real-time filtering
- [x] Search UI with icon

#### Export/Import ✅
- [x] Export notes as JSON
- [x] Export notes as CSV
- [x] Export notes as Markdown
- [x] Import from JSON
- [x] Import from CSV
- [x] File download utilities
- [x] Error handling for imports

#### Socket.IO Real-Time Updates ✅
- [x] Socket.IO server setup
- [x] Socket.IO client integration
- [x] useRealtimeUpdates custom hook
- [x] Real-time event handlers
- [x] Auto-reconnection with exponential backoff
- [x] User authentication via socket auth
- [x] Event types: note:created, note:updated, note:deleted

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### Installation

#### 1. Clone and Install Dependencies
```bash
cd shahmeer-mern-10pearls-NotesApp

# Frontend setup
npm install

# Backend setup
cd backend
npm install
cd ..
```

#### 2. Configure Environment Variables

**Frontend (.env)**
```bash
cp .env.example .env
# Edit if needed (default values work for local development)
```

**Backend (.env)**
```bash
cd backend
cp .env.example .env
# Edit with your PostgreSQL credentials
```

#### 3. Database Setup

```bash
# Create database
createdb notes_app

# Run migrations
psql notes_app < backend/src/migrations/001_create_schema.sql
```

#### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# App runs on http://localhost:5173
```

### Docker Setup (Optional)

```bash
# For production deployment, create a Dockerfile for each service
docker-compose up
```

## 📖 API Documentation

### Authentication
All endpoints (except `/health`) require Bearer token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Endpoints

#### Health Check
```
GET /health
Response: { success: true, message: "Server is running" }
```

#### Notes API
```
POST   /api/notes              - Create note
GET    /api/notes              - List notes (with search, pagination)
GET    /api/notes/:id          - Get single note
PUT    /api/notes/:id          - Update note
DELETE /api/notes/:id          - Delete note
GET    /api/notes/export/:format - Export (json/csv)
```

#### Users API
```
POST        /api/users            - Create/get user
GET         /api/users/profile    - Get current user
PUT         /api/users/profile    - Update user
```

## 🧪 Testing

### Run All Tests
```bash
# Frontend
npm test

# Backend
cd backend && npm test
```

### Test Coverage
```bash
# Frontend
npm run test:coverage

# Backend
cd backend && npm test -- --reporter html
```

### Watch Mode
```bash
# Frontend
npm run test:watch

# Backend
cd backend && npm run test:watch
```

## 📊 Code Quality

### ESLint
```bash
# Frontend
npm run lint
npm run lint:fix

# Backend
cd backend
npm run lint
npm run lint:fix
```

### SonarQube Analysis
```bash
# Install sonar-scanner globally
npm install -g sonarqube-scanner

# Run analysis (ensure SonarQube server is running)
sonar-scanner
```

## 🔍 Features

### User Management
- Sign up with email and password
- Login/logout
- User profile view and edit
- Session persistence

### Note Management
- Create rich-text notes with formatting
- Edit existing notes
- Delete notes with confirmation
- View list of all user notes
- Responsive grid layout

### Search & Filter
- Real-time search by title/content
- Sort by date (newest/oldest)
- Sort alphabetically
- Case-insensitive search

### Export/Import
- Export all notes as JSON
- Export all notes as CSV
- Export all notes as Markdown
- Import notes from JSON/CSV files

### Rich Text Editing
- Bold, italic, headings
- Unordered and ordered lists
- HTML output
- Intuitive toolbar

### Real-Time Updates
- WebSocket connection via Socket.IO
- Real-time note synchronization
- Auto-reconnection on disconnect
- Event-based architecture

### Logging
- Pino logger for all operations
- Request/response logging
- Error logging with stack traces
- Activity tracking (create, update, delete)

### Security
- Helmet security headers
- CORS configuration
- Row-level security (RLS) in database
- User data isolation
- Input validation
- Error handling without leaking sensitive info

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔐 Security Considerations

1. **Authentication**: Uses Supabase Auth (frontend fallback) with JWT tokens
2. **Database**: PostgreSQL with RLS policies for user data isolation
3. **CORS**: Configured for frontend origin only
4. **Headers**: Helmet middleware for security headers
5. **Input Validation**: Server-side validation on all inputs
6. **Error Messages**: Generic error messages to prevent info leaks

## 🚨 Error Handling

All API responses follow consistent format:
```json
{
  "success": true/false,
  "data": { ... },        // On success
  "error": {              // On error
    "message": "User-friendly message",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

## 📈 Performance

- Database indexes on frequently queried columns
- Connection pooling for database
- Full-text search support
- Pagination support (default 10 items/page)
- Gzip compression
- CSS/JS minification in production

## 🔄 Git Workflow (10P SHINE)

Follow the branching strategy:

```bash
# Feature branch
git checkout develop
git pull origin develop
git checkout -b feature/frontend/rich-text-editor

# Make changes
git add .
git commit -m "Add rich text editor component"

# Push and create PR
git push origin feature/frontend/rich-text-editor

# PR from feature branch to develop (requires review)
# After approval, merge to develop
# Periodically, develop → main (production)
```

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Backend (.env)
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

## 📚 Documentation

- [Backend README](backend/README.md)
- [Frontend README](./README.md)
- [API Documentation](#-api-documentation)
- [Project Audit Report](AUDIT_REPORT.md)

## 🤝 Contributing

1. Follow 10P SHINE branching strategy
2. Create feature branches from `develop`
3. Write tests for new features
4. Run linter and tests before pushing
5. Create pull request for review
6. Get approval before merging to develop

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Review API documentation
3. Check component examples
4. Review test files for usage patterns

## 📄 License

This project is part of 10Pearls internship program - Shahmeer MERN Stack

## ✨ Highlights

- ✅ Complete full-stack implementation
- ✅ Comprehensive logging with Pino
- ✅ Full test coverage (unit & component tests)
- ✅ Rich text editing capabilities
- ✅ Real-time synchronization
- ✅ Search and filter functionality
- ✅ Export/import features
- ✅ Code quality monitoring (SonarQube)
- ✅ Production-ready error handling
- ✅ Security best practices

## 🎯 Future Enhancements

- [ ] Collaborative editing (multiple users)
- [ ] Note sharing and collaboration
- [ ] Tag/category management
- [ ] Advanced search with filters
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Offline support (Service Workers)
- [ ] Webhooks for third-party integrations
- [ ] Rate limiting
- [ ] API versioning

---

**Project Status**: All Phase 1-3 requirements implemented ✅

**Last Updated**: June 8, 2026
