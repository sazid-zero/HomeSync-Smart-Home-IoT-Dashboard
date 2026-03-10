import { SensorModel } from '../models/SensorReading.js';
export const sensorController = {
    async getReadings(req, res, next) {
        try {
            const { deviceId, type, range } = req.query;
            const readings = await SensorModel.getReadings({
                userId: req.user.userId,
                deviceId: deviceId,
                readingType: type,
                range: range || '24h',
            });
            res.json({ readings });
        }
        catch (error) {
            next(error);
        }
    },
    async getAnalytics(req, res, next) {
        try {
            const { period } = req.query;
            const analytics = await SensorModel.getAnalytics(req.user.userId, period || 'weekly');
            res.json({ analytics });
        }
        catch (error) {
            next(error);
        }
    },
    async getAirQuality(req, res, next) {
        try {
            const data = await SensorModel.getAirQuality(req.user.userId);
            res.json({ airQuality: data || { co2: 0, pollutant: 0 } });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=sensorController.js.map