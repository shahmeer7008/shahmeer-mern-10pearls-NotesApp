# Notes App

A full-stack notes application built with:

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Realtime: Socket.IO
- Auth: JWT-based authentication
- Styling: Tailwind CSS

## Project Structure

- `src/` - frontend source code
- `backend/` - backend API source code
- `backend/src/migrations/` - PostgreSQL schema migrations

## Requirements

- Node.js 16+
- npm 10+ (bundled with Node.js)
- PostgreSQL 12+

## Local Setup

### 1. Install dependencies

From the project root:

```bash
npm install
```

Then install backend dependencies:

```bash
cd backend
npm install
```

### 2. Create PostgreSQL database

Open `psql` and run:

```sql
CREATE DATABASE notes_app;
```

### 3. Configure backend

Copy the example environment file in the backend folder:

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env` to match your local PostgreSQL connection settings.

### 4. Apply database migration

From the `backend` folder:

```bash
psql notes_app < src/migrations/001_create_schema.sql
```

### 5. Start the backend

From `backend`:

```bash
npm run dev
```

The backend runs by default on `http://localhost:3001`.

### 6. Start the frontend

From the project root:

```bash
npm run dev
```

The frontend runs by default on `http://localhost:5173`.

## Available Scripts

### Frontend

- `npm run dev` - start Vite development server
- `npm run build` - build production frontend
- `npm run lint` - run ESLint
- `npm run test` - run Jest tests
- `npm run sonarqube` - run SonarQube scanner

### Backend

From `backend/`:

- `npm run dev` - start backend with ts-node
- `npm run build` - compile TypeScript
- `npm run test` - run backend tests
- `npm run lint` - run backend ESLint
- `npm run sonarqube` - run SonarQube scanner

## How to Use

1. Open `http://localhost:5173`
2. Sign up for a new account
3. Log in and create notes
4. Use rich text formatting in the editor
5. Import/export notes and see realtime updates

## Notes

- The frontend now uses backend JWT auth and no longer depends on Supabase for core flows.
- Profile and note APIs are handled through the Express backend.
- Realtime updates are delivered through Socket.IO.

## Troubleshooting

### `node` or `npm` not found

Install Node.js and ensure the installation folder is on your PATH.

### Backend not connecting to PostgreSQL

Verify your `backend/.env` values and confirm PostgreSQL is running.

### Ports already in use

- Frontend: `5173`
- Backend: `3001`

Kill the conflicting process or change the port in the config.

## Additional Documentation

This repository uses a single main documentation file: `README.md`.

---

Happy coding! 👩‍💻👨‍💻
