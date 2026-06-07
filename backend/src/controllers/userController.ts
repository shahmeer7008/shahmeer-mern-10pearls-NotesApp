// User Controller
import { Request, Response } from 'express';
import UserService from '../services/UserService.js';
import UserModel from '../models/User.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export const userController = {
  // GET /api/users/profile - Get current user profile
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User ID is required', 401, 'UNAUTHORIZED');
    }

    const user = await UserService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  // PUT /api/users/profile - Update current user profile
  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User ID is required', 401, 'UNAUTHORIZED');
    }

    // Validate input
    const errors = UserModel.validateInput(email);
    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400, 'VALIDATION_ERROR');
    }

    const user = await UserService.updateUser(userId, email);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  // POST /api/users - Get or create user (for new signups)
  getOrCreateUser: asyncHandler(async (req: Request, res: Response) => {
    const { userId, email } = req.body;

    if (!userId || !email) {
      throw new AppError('User ID and email are required', 400, 'VALIDATION_ERROR');
    }

    // Validate email
    const errors = UserModel.validateInput(email);
    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400, 'VALIDATION_ERROR');
    }

    const user = await UserService.getOrCreateUser(userId, email);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),
};

export default userController;
