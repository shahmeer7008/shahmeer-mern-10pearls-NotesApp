# Quick Setup Guide

This guide will help you get the full-stack Notes App running locally in about 10 minutes.

## 📋 Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

Verify installations:
```bash
node --version  # Should be 16+
npm --version   # Comes with Node.js
psql --version  # Should be 12+
```

## 🚀 Setup Steps

### Step 1: Setup Database (5 minutes)

#### On macOS with Homebrew:
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### On Linux:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

#### On Windows:
Download and install from https://www.postgresql.org/download/windows/

#### Create Database:
```bash
# Login to PostgreSQL
psql postgres

# In psql prompt:
CREATE DATABASE notes_app;
\q  # Exit psql
```

### Step 2: Backend Setup (3 minutes)

```bash
# Navigate to backend
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# (On macOS/Linux, default user is 'postgres' with no password)

# Install dependencies
npm install

# Run database migrations
psql notes_app < src/migrations/001_create_schema.sql

# Start backend server
npm run dev
```

You should see:
```
==========================================
🚀 Notes App Server Started
==========================================
Server running on: http://localhost:3001
Environment: development
```

**Keep this terminal open!**

### Step 3: Frontend Setup (2 minutes)

Open a **new terminal** in the project root:

```bash
# Copy environment file (optional, defaults work)
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:
```
  VITE v5.4.2  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

## 🎯 First Test

1. **Open** http://localhost:5173 in your browser
2. **Click** "Sign Up"
3. **Create** an account with any email/password
4. **Create** your first note!
5. **Try** formatting with bold, italic, and lists

## 🧪 Run Tests

### Frontend Tests:
```bash
npm test                # Run once
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

### Backend Tests:
```bash
cd backend
npm test                # Run once
npm run test:watch      # Watch mode
```

## 📊 SonarQube (Optional)

If you want to analyze code quality:

```bash
# Install sonar-scanner globally
npm install -g sonarqube-scanner

# Run from project root
sonar-scanner
```

## 🔍 Troubleshooting

### Port 3001 already in use:
```bash
# On macOS/Linux, find and kill process
lsof -ti:3001 | xargs kill -9

# Then restart backend
cd backend && npm run dev
```

### Port 5173 already in use:
```bash
# Either kill the process or Vite will use next available port
```

### PostgreSQL connection failed:
```bash
# Check PostgreSQL is running
psql postgres -c "SELECT version();"

# If not running:
# macOS: brew services start postgresql@15
# Linux: sudo service postgresql start
# Windows: Check Services (services.msc)
```

### Database doesn't exist:
```bash
psql postgres
CREATE DATABASE notes_app;
\q
psql notes_app < backend/src/migrations/001_create_schema.sql
```

### Dependencies installation fails:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📁 Important Files

- **Backend**: `backend/src/index.ts` - Express server
- **Frontend**: `src/App.tsx` - Main app component
- **Database**: `backend/src/migrations/001_create_schema.sql` - Schema
- **Config**: `.env` files for both frontend and backend
- **Logs**: Backend logs are printed to terminal (Pino logger)

## 🔗 API Base URL

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **API Docs**: Check [COMPLETE_README.md](COMPLETE_README.md)

## 📚 Learn More

- [Full Documentation](COMPLETE_README.md)
- [Audit Report](AUDIT_REPORT.md)
- [Backend README](backend/README.md)

## ✅ Success Checklist

- [ ] PostgreSQL running
- [ ] Database created
- [ ] Backend server running on port 3001
- [ ] Frontend server running on port 5173
- [ ] Can sign up and create a note
- [ ] Tests pass (optional)

## 💡 Next Steps

1. **Explore Features**:
   - Create notes with rich text formatting
   - Search and filter notes
   - Export notes to JSON/CSV
   - Sort by date or title

2. **Development**:
   - Create feature branches: `git checkout -b feature/backend/feature-name`
   - Run tests: `npm test`
   - Check code quality: `npm run lint`

3. **Deployment**:
   - See [COMPLETE_README.md](COMPLETE_README.md) for production setup
   - Deploy frontend to Vercel/Netlify
   - Deploy backend to Railway/Heroku

## 🆘 Still Having Issues?

1. Check PostgreSQL is running: `psql postgres`
2. Verify database exists: `psql notes_app`
3. Check both servers are running
4. Check console for error messages
5. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)

---

**Happy Coding! 🚀**
