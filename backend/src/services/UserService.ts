// User Service - Business Logic
import pool from '../config/database.js';
import logger from '../config/logger.js';
import { AppError } from '../middleware/errorHandler.js';

export class UserService {
  // Get user by ID
  static async getUserById(userId: string) {
    try {
      const query = 'SELECT id, email, created_at, updated_at FROM users WHERE id = $1';
      const result = await pool.query(query, [userId]);

      if (result.rows.length === 0) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      logger.info({
        type: 'USER_FETCHED',
        userId,
      });

      return result.rows[0];
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error({ type: 'USER_FETCH_ERROR', error: err, userId });
      throw new AppError('Failed to fetch user', 500, 'USER_FETCH_ERROR');
    }
  }

  // Get or create user
  static async getOrCreateUser(userId: string, email: string) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Try to fetch existing user
      let result = await client.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length > 0) {
        await client.query('COMMIT');
        return result.rows[0];
      }

      // Create new user
      result = await client.query(
        `INSERT INTO users (id, email, created_at, updated_at) 
         VALUES ($1, $2, NOW(), NOW()) 
         RETURNING id, email, created_at, updated_at`,
        [userId, email]
      );

      await client.query('COMMIT');

      logger.info({
        type: 'USER_CREATED',
        userId,
        email,
      });

      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      logger.error({ type: 'USER_CREATE_ERROR', error: err, userId, email });
      throw new AppError('Failed to create user', 500, 'USER_CREATE_ERROR');
    } finally {
      client.release();
    }
  }

  // Update user email
  static async updateUser(userId: string, email: string) {
    try {
      const query = `
        UPDATE users 
        SET email = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, email, created_at, updated_at
      `;

      const result = await pool.query(query, [email, userId]);

      if (result.rows.length === 0) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      logger.info({
        type: 'USER_UPDATED',
        userId,
      });

      return result.rows[0];
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error({ type: 'USER_UPDATE_ERROR', error: err, userId });
      throw new AppError('Failed to update user', 500, 'USER_UPDATE_ERROR');
    }
  }
}

export default UserService;
