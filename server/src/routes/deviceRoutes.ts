import { Router } from 'express';
import { deviceController } from '../controllers/deviceController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', deviceController.getAll);
router.get('/power-consumption', deviceController.getPowerConsumption);
router.get('/room/:roomId', deviceController.getByRoom);
router.get('/:id', deviceController.getById);
router.post('/', deviceController.create);
router.put('/:id', deviceController.update);
router.patch('/:id/toggle', deviceController.toggle);
router.patch('/:id/value', deviceController.updateValue);
router.delete('/:id', deviceController.delete);

export default router;
