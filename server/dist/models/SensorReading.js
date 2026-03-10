import { query } from '../config/database.js';
export const SensorModel = {
    async create(deviceId, readingType, value, unit) {
        const result = await query('INSERT INTO sensor_readings (device_id, reading_type, value, unit) VALUES ($1, $2, $3, $4) RETURNING *', [deviceId, readingType, value, unit]);
        return result.rows[0];
    },
    async createBatch(readings) {
        if (readings.length === 0)
            return;
        const values = [];
        const placeholders = [];
        readings.forEach((r, i) => {
            const offset = i * 4;
            placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);
            values.push(r.device_id, r.reading_type, r.value, r.unit);
        });
        await query(`INSERT INTO sensor_readings (device_id, reading_type, value, unit) VALUES ${placeholders.join(', ')}`, values);
    },
    async getReadings(params) {
        let timeFilter = "interval '24 hours'";
        switch (params.range) {
            case '1h':
                timeFilter = "interval '1 hour'";
                break;
            case '24h':
                timeFilter = "interval '24 hours'";
                break;
            case '7d':
                timeFilter = "interval '7 days'";
                break;
            case '30d':
                timeFilter = "interval '30 days'";
                break;
        }
        const conditions = [`sr.recorded_at > NOW() - ${timeFilter}`, 'd.user_id = $1'];
        const values = [params.userId];
        let paramIndex = 2;
        if (params.deviceId) {
            conditions.push(`sr.device_id = $${paramIndex++}`);
            values.push(params.deviceId);
        }
        if (params.readingType) {
            conditions.push(`sr.reading_type = $${paramIndex++}`);
            values.push(params.readingType);
        }
        const result = await query(`SELECT sr.* FROM sensor_readings sr
      JOIN devices d ON d.id = sr.device_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY sr.recorded_at ASC`, values);
        return result.rows;
    },
    async getAnalytics(userId, period = 'weekly') {
        let interval = "interval '7 days'";
        let truncate = 'day';
        switch (period) {
            case 'daily':
                interval = "interval '24 hours'";
                truncate = 'hour';
                break;
            case 'weekly':
                interval = "interval '7 days'";
                truncate = 'day';
                break;
            case 'monthly':
                interval = "interval '30 days'";
                truncate = 'day';
                break;
        }
        const result = await query(`SELECT
        DATE_TRUNC('${truncate}', sr.recorded_at) AS date,
        ROUND(SUM(sr.value)::numeric, 2) AS total_consumption,
        COUNT(*)::int AS reading_count
      FROM sensor_readings sr
      JOIN devices d ON d.id = sr.device_id
      WHERE d.user_id = $1
        AND sr.reading_type = 'power'
        AND sr.recorded_at > NOW() - ${interval}
      GROUP BY DATE_TRUNC('${truncate}', sr.recorded_at)
      ORDER BY date ASC`, [userId]);
        return result.rows;
    },
    async getAirQuality(userId) {
        const result = await query(`SELECT
        (SELECT sr.value FROM sensor_readings sr JOIN devices d ON d.id = sr.device_id
         WHERE d.user_id = $1 AND sr.reading_type = 'co2'
         ORDER BY sr.recorded_at DESC LIMIT 1) AS co2,
        (SELECT sr.value FROM sensor_readings sr JOIN devices d ON d.id = sr.device_id
         WHERE d.user_id = $1 AND sr.reading_type = 'pollutant'
         ORDER BY sr.recorded_at DESC LIMIT 1) AS pollutant`, [userId]);
        return result.rows[0] || null;
    },
};
//# sourceMappingURL=SensorReading.js.map