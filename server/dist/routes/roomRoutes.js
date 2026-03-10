import { Router } from 'express';
import { roomController } from '../controllers/roomController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.get('/', roomController.getAll);
router.get('/:id', roomController.getById);
router.post('/', roomController.create);
router.put('/:id', roomController.update);
router.delete('/:id', roomController.delete);
export default router;
//# sourceMappingURL=roomRoutes.js.map