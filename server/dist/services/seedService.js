import { query } from '../config/database.js';
const DEFAULT_ROOMS = [
    { name: 'Lounge', icon: 'living-room' },
    { name: 'Hall', icon: 'hall' },
    { name: 'Bedroom', icon: 'bedroom' },
    { name: 'Kitchen', icon: 'kitchen' },
];
const DEFAULT_DEVICES = [
    { room: 'lounge', name: 'TV set', type: 'tv', control_type: 'toggle', is_on: true, icon_name: 'monitor' },
    { room: 'lounge', name: 'Air Condition', type: 'ac', control_type: 'toggle', is_on: true, icon_name: 'air-conditioner' },
    { room: 'lounge', name: 'Backlight', type: 'light', control_type: 'slider', value: 70, is_on: true, icon_name: 'light-bulb' },
    { room: 'bedroom', name: 'Lamp', type: 'light', control_type: 'slider', value: 30, is_on: true, icon_name: 'light-bulb' },
    { room: 'kitchen', name: 'Coffee Maker', type: 'appliance', control_type: 'toggle', is_on: false, icon_name: 'plug' },
];
/**
 * Seeds default rooms & devices for a newly registered user.
 * This provides an instant "populated dashboard" experience.
 */
export async function seedDefaultData(userId) {
    try {
        // 1. Create rooms
        const roomIds = {};
        for (const r of DEFAULT_ROOMS) {
            const res = await query('INSERT INTO rooms (user_id, name, icon) VALUES ($1, $2, $3) RETURNING id', [userId, r.name, r.icon]);
            roomIds[r.name.toLowerCase()] = res.rows[0].id;
        }
        // 2. Create devices
        for (const d of DEFAULT_DEVICES) {
            await query(`INSERT INTO devices (room_id, user_id, name, type, control_type, is_on, value, power_consumption, icon_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [roomIds[d.room], userId, d.name, d.type, d.control_type, d.is_on, d.value || 0, Math.random() * 5, d.icon_name]);
        }
        console.log(`[Seed] Default data created for user ${userId}`);
    }
    catch (err) {
        console.error('[Seed] Failed to seed default data:', err);
        // Non-fatal — user can still use the app, just with empty dashboard
    }
}
//# sourceMappingURL=seedService.js.map