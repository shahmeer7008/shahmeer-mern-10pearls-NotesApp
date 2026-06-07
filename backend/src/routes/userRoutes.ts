// User Routes
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import userController from '../controllers/userController.js';

const router = Router();

// Public route - get or create user
router.post('/', userController.getOrCreateUser);

// Protected routes
router.use(authMiddleware);

// Get current user profile
router.get('/profile', userController.getProfile);

// Update current user profile
router.put('/profile', userController.updateProfile);

export default router;
