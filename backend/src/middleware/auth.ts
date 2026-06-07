// Authentication Middleware
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';
import logger from '../config/logger.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Missing or invalid authorization header', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.substring(7);

    // For now, extract user ID from token (in production, validate JWT)
    // This is a simplified implementation
    const userId = extractUserIdFromToken(token);

    if (!userId) {
      throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
    }

    req.userId = userId;
    req.user = {
      id: userId,
    };

    logger.info({
      type: 'AUTH',
      userId,
      path: req.path,
    });

    next();
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
    } else {
      next(new AppError('Authentication failed', 401, 'AUTH_FAILED'));
    }
  }
};

function extractUserIdFromToken(token: string): string | null {
  try {
    // Decode JWT token (simplified - use jsonwebtoken in production)
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );

    return decoded.sub || decoded.user_id || decoded.id || null;
  } catch (err) {
    return null;
  }
}

export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const userId = extractUserIdFromToken(token);

      if (userId) {
        req.userId = userId;
        req.user = { id: userId };
      }
    }

    next();
  } catch (err) {
    // Optional auth, so continue even if it fails
    next();
  }
};
