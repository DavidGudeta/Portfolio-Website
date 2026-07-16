import { Router } from 'express';
import * as testimonialController from '../controllers/testimonialController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/', testimonialController.getTestimonials);

// Admin routes
router.post('/', authenticate, requireAdmin, testimonialController.addTestimonial);
router.put('/:id', authenticate, requireAdmin, testimonialController.updateTestimonial);
router.delete('/:id', authenticate, requireAdmin, testimonialController.deleteTestimonial);

export default router;
