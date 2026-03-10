import { Request, Response, NextFunction } from 'express';
import { SensorModel } from '../models/SensorReading.js';

export const sensorController = {
  async getReadings(req: Request, res: Response, next: NextFunction) {
    try {
      const { deviceId, type, range } = req.query;
      const readings = await SensorModel.getReadings({
        userId: req.user!.userId,
        deviceId: deviceId as string | undefined,
        readingType: type as string | undefined,
        range: (range as string) || '24h',
      });
      res.json({ readings });
    } catch (error) { next(error); }
  },

  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { period } = req.query;
      const analytics = await SensorModel.getAnalytics(req.user!.userId, (period as string) || 'weekly');
      res.json({ analytics });
    } catch (error) { next(error); }
  },

  async getAirQuality(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SensorModel.getAirQuality(req.user!.userId);
      res.json({ airQuality: data || { co2: 0, pollutant: 0 } });
    } catch (error) { next(error); }
  },
};
