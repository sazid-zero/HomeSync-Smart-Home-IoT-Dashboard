import { Router } from 'express';
import { sensorController } from '../controllers/sensorController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/readings', sensorController.getReadings);
router.get('/analytics', sensorController.getAnalytics);
router.get('/air-quality', sensorController.getAirQuality);

export default router;
