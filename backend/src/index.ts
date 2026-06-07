// Main Express Server
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './config/logger.js';
import requestLogger from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import noteRoutes from './routes/noteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(requestLogger);

// Health check route
app.use('/', healthRoutes);

// API Routes
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Not Found',
      code: 'NOT_FOUND',
      status: 404,
    },
  });
});

// Global Error Handler (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  logger.info(`
    ==========================================
    🚀 Notes App Server Started
    ==========================================
    Server running on: http://localhost:${PORT}
    Environment: ${process.env.NODE_ENV || 'development'}
    CORS Origin: ${CORS_ORIGIN}
    ==========================================
  `);
});

export default app;
