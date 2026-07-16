import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Public routes (or authenticated if needed)
router.get('/profile/:uid', authenticate, userController.getUserProfile);
router.post('/profile', authenticate, userController.createUserProfile);

export default router;
