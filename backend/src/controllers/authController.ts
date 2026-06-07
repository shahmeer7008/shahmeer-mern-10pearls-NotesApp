import { Request, Response } from 'express';
import AuthService from '../services/AuthService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export const authController = {
  signUp: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400, 'VALIDATION_ERROR');
    }

    const { user, token } = await AuthService.signUp(email, password);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400, 'VALIDATION_ERROR');
    }

    const { user, token } = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  }),
};

export default authController;
