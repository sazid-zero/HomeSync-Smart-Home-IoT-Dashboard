import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.get('/', notificationController.getAll);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);
router.delete('/', notificationController.deleteAll);
router.delete('/:id', notificationController.delete);
export default router;
//# sourceMappingURL=notificationRoutes.js.map