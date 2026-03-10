import { pool } from '../config/database.js';
import { hashPassword } from '../utils/hash.js';
async function seed() {
    console.log('Seeding demo data...');
    try {
        // Check if demo user exists
        const userRes = await pool.query('SELECT id FROM users WHERE email = $1', ['demo@homesync.app']);
        if (userRes.rows.length > 0) {
            console.log('Demo user already exists. Skipping seed.');
            return;
        }
        // 1. Create User
        const hash = await hashPassword('password123');
        const newUser = await pool.query(`INSERT INTO users (name, email, password_hash, avatar_url)
       VALUES ($1, $2, $3, $4) RETURNING id`, ['Demo User', 'demo@homesync.app', hash, '/profile.jpg']);
        const userId = newUser.rows[0].id;
        // 2. Create Rooms
        const rooms = [
            { name: 'Lounge', icon: 'living-room' },
            { name: 'Hall', icon: 'hall' },
            { name: 'Bedroom', icon: 'bedroom' },
            { name: 'Kitchen', icon: 'kitchen' }
        ];
        const roomIds = {};
        for (const r of rooms) {
            const res = await pool.query('INSERT INTO rooms (user_id, name, icon) VALUES ($1, $2, $3) RETURNING id', [userId, r.name, r.icon]);
            roomIds[r.name.toLowerCase()] = res.rows[0].id;
        }
        // 3. Create Devices
        const devices = [
            { room_id: roomIds['lounge'], name: 'TV set', type: 'tv', control_type: 'toggle', is_on: true, icon_name: 'monitor' },
            { room_id: roomIds['lounge'], name: 'Air Condition', type: 'ac', control_type: 'toggle', is_on: true, icon_name: 'air-conditioner' },
            { room_id: roomIds['lounge'], name: 'Backlight', type: 'light', control_type: 'slider', value: 70, is_on: true, icon_name: 'light-bulb' },
            { room_id: roomIds['bedroom'], name: 'Lamp', type: 'light', control_type: 'slider', value: 30, is_on: true, icon_name: 'light-bulb' },
            { room_id: roomIds['kitchen'], name: 'Coffee Maker', type: 'appliance', control_type: 'toggle', is_on: false, icon_name: 'plug' }
        ];
        for (const d of devices) {
            await pool.query(`INSERT INTO devices (room_id, user_id, name, type, control_type, is_on, value, power_consumption, icon_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [d.room_id, userId, d.name, d.type, d.control_type, d.is_on, d.value || 0, Math.random() * 5, d.icon_name]);
        }
        console.log('✅ Seeding successful.');
        console.log('Demo Login: demo@homesync.app / password123');
    }
    catch (err) {
        console.error('❌ Seeding failed:', err);
    }
    finally {
        pool.end();
    }
}
seed();
//# sourceMappingURL=seed.js.map