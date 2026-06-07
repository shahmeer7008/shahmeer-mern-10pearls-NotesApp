import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import logger from '../config/logger.js';
import { AppError } from '../middleware/errorHandler.js';
import UserModel from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export class AuthService {
  static createToken(userId: string) {
    return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static async signUp(email: string, password: string) {
    const errors = UserModel.validateInput(email);
    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400, 'VALIDATION_ERROR');
    }

    if (!password || password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400, 'VALIDATION_ERROR');
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        throw new AppError('User already exists', 409, 'USER_EXISTS');
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      const result = await client.query(
        `INSERT INTO users (id, email, password_hash, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         RETURNING id, email, created_at, updated_at`,
        [userId, email, passwordHash]
      );

      await client.query('COMMIT');

      const user = result.rows[0];
      const token = this.createToken(user.id);

      logger.info({ type: 'USER_SIGNED_UP', userId: user.id, email });
      return { user, token };
    } catch (err) {
      await client.query('ROLLBACK');
      if (err instanceof AppError) throw err;
      logger.error({ type: 'AUTH_SIGNUP_ERROR', error: err, email });
      throw new AppError('Failed to create user', 500, 'AUTH_SIGNUP_ERROR');
    } finally {
      client.release();
    }
  }

  static async login(email: string, password: string) {
    if (!email || !password) {
      throw new AppError('Email and password are required', 400, 'VALIDATION_ERROR');
    }

    const user = await this.getUserByEmail(email);
    const passwordHash = (user as any).password_hash;

    const passwordMatches = await bcrypt.compare(password, passwordHash);
    if (!passwordMatches) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const token = this.createToken(user.id);
    return { user: { id: user.id, email: user.email, created_at: user.created_at, updated_at: user.updated_at }, token };
  }

  static async getUserByEmail(email: string) {
    try {
      const query = 'SELECT id, email, password_hash, created_at, updated_at FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);

      if (result.rows.length === 0) {
        throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
      }

      return result.rows[0];
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error({ type: 'AUTH_LOGIN_ERROR', error: err, email });
      throw new AppError('Failed to login', 500, 'AUTH_LOGIN_ERROR');
    }
  }
}

export default AuthService;
