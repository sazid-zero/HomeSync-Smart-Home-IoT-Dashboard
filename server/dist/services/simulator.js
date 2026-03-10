import { DeviceModel } from '../models/Device.js';
import { SensorModel } from '../models/SensorReading.js';
import { NotificationModel } from '../models/Notification.js';
import { env } from '../config/env.js';
import { query } from '../config/database.js';
let intervalId = null;
// Helper to get random number in range
const randomRange = (min, max) => Math.random() * (max - min) + min;
export function startSimulator(io) {
    if (intervalId)
        return;
    console.log(`[Simulator] Started. Running every ${env.SIMULATOR_INTERVAL_MS}ms`);
    intervalId = setInterval(async () => {
        try {
            // 1. Get all active users to simulate data for
            const usersResult = await query('SELECT id FROM users');
            const users = usersResult.rows;
            for (const user of users) {
                const userId = user.id;
                // 2. Generate environmental data (Temperature, Humidity, Air Quality)
                // These are simulated per user rather than per device for simplicity in the dashboard
                const temperature = parseFloat(randomRange(20, 26).toFixed(1)); // 20-26°C
                const humidity = parseFloat(randomRange(40, 60).toFixed(1)); // 40-60%
                const co2 = Math.floor(randomRange(400, 1000)); // 400-1000 ppm
                const pollutant = Math.floor(randomRange(10, 80)); // 10-80 AQN
                io.to(userId).emit('environment:update', { temperature, humidity, co2, pollutant });
                // Sometimes trigger a notification
                if (temperature > 25.5) {
                    const notif = await NotificationModel.create(userId, 'High Temperature Alert', `Indoor temperature has reached ${temperature}°C.`, 'warning');
                    io.to(userId).emit('notification:new', notif);
                }
                if (co2 > 900) {
                    const notif = await NotificationModel.create(userId, 'Poor Air Quality', `CO2 levels elevated to ${co2} ppm. Consider opening a window.`, 'critical');
                    io.to(userId).emit('notification:new', notif);
                }
                // 3. Simulate Device Power Consumption
                const devices = await DeviceModel.findAllByUser(userId);
                const readings = [];
                const powerUpdates = [];
                for (const device of devices) {
                    // Only generate power if the device is ON
                    if (device.is_on) {
                        // Base power depends on device type, plus some random fluctuation
                        let basePowerKw = 0.5; // default 500W
                        if (device.type.toLowerCase().includes('ac') || device.name.toLowerCase().includes('condition'))
                            basePowerKw = 2.5;
                        if (device.type.toLowerCase().includes('heater'))
                            basePowerKw = 2.0;
                        if (device.type.toLowerCase().includes('light') || device.type.toLowerCase().includes('lamp')) {
                            // If it's a slider, power scales with value (0-100%)
                            const intensity = device.control_type === 'slider' ? device.value / 100 : 1;
                            basePowerKw = 0.06 * intensity; // 60W max
                        }
                        if (device.type.toLowerCase().includes('tv') || device.type.toLowerCase().includes('monitor'))
                            basePowerKw = 0.15;
                        const currentConsumption = parseFloat(randomRange(basePowerKw * 0.9, basePowerKw * 1.1).toFixed(3));
                        // Accumulate total power consumption for the device (in an hour this would be currentConsumption kWh,
                        // but for simulator we just add a small fraction so the number goes up slowly)
                        const addedKwh = currentConsumption / (3600000 / env.SIMULATOR_INTERVAL_MS); // Assuming Interval is ms
                        const newTotalConsumption = parseFloat((Number(device.power_consumption) + addedKwh).toFixed(4));
                        readings.push({ device_id: device.id, reading_type: 'power', value: currentConsumption, unit: 'kW' });
                        powerUpdates.push({ id: device.id, consumption: newTotalConsumption });
                        // Store CO2/Pollutant readings associated with random devices just to have data in DB
                        readings.push({ device_id: device.id, reading_type: 'co2', value: co2, unit: 'ppm' });
                        readings.push({ device_id: device.id, reading_type: 'pollutant', value: pollutant, unit: 'AQN' });
                    }
                }
                if (readings.length > 0) {
                    await SensorModel.createBatch(readings);
                }
                for (const update of powerUpdates) {
                    await DeviceModel.update(update.id, userId, { power_consumption: update.consumption });
                    // We don't emit this every single time to avoid flooding the frontend unless power view is open
                    // But for now, let's emit a aggregate event
                }
                if (powerUpdates.length > 0) {
                    const powerData = await DeviceModel.getPowerConsumption(userId);
                    io.to(userId).emit('device:power_update', powerData);
                }
            }
        }
        catch (error) {
            console.error('[Simulator Error]:', error);
        }
    }, env.SIMULATOR_INTERVAL_MS);
}
export function stopSimulator() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('[Simulator] Stopped.');
    }
}
//# sourceMappingURL=simulator.js.map