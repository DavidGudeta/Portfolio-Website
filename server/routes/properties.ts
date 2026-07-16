import { Router } from 'express';
import * as propertyController from '../controllers/propertyController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/', propertyController.getProperties);
router.post('/inquiries', propertyController.addInquiry);

// Admin routes
router.post('/', authenticate, requireAdmin, propertyController.addProperty);
router.put('/:id', authenticate, requireAdmin, propertyController.updateProperty);
router.delete('/:id', authenticate, requireAdmin, propertyController.deleteProperty);
router.get('/inquiries', authenticate, requireAdmin, propertyController.getInquiries);
router.delete('/inquiries/:id', authenticate, requireAdmin, propertyController.deleteInquiry);

export default router;
