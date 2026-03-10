import { query } from '../config/database.js';
export const DeviceModel = {
    async findAllByUser(userId) {
        const result = await query(`SELECT d.*, r.name AS room_name
      FROM devices d
      LEFT JOIN rooms r ON r.id = d.room_id
      WHERE d.user_id = $1
      ORDER BY d.created_at ASC`, [userId]);
        return result.rows;
    },
    async findByRoom(roomId, userId) {
        const result = await query('SELECT * FROM devices WHERE room_id = $1 AND user_id = $2 ORDER BY created_at ASC', [roomId, userId]);
        return result.rows;
    },
    async findById(id, userId) {
        const result = await query(`SELECT d.*, r.name AS room_name
      FROM devices d
      LEFT JOIN rooms r ON r.id = d.room_id
      WHERE d.id = $1 AND d.user_id = $2`, [id, userId]);
        return result.rows[0] || null;
    },
    async create(data) {
        const result = await query(`INSERT INTO devices (room_id, user_id, name, type, control_type, power_consumption, icon_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [data.room_id, data.user_id, data.name, data.type, data.control_type, data.power_consumption || 0, data.icon_name || null]);
        return result.rows[0];
    },
    async update(id, userId, data) {
        const fields = [];
        const values = [];
        let paramIndex = 1;
        const entries = Object.entries(data).filter(([, v]) => v !== undefined);
        for (const [key, value] of entries) {
            fields.push(`${key} = $${paramIndex++}`);
            values.push(value);
        }
        if (fields.length === 0)
            return null;
        values.push(id, userId);
        const result = await query(`UPDATE devices SET ${fields.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex} RETURNING *`, values);
        return result.rows[0] || null;
    },
    async toggle(id, userId) {
        const result = await query('UPDATE devices SET is_on = NOT is_on WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
        return result.rows[0] || null;
    },
    async updateValue(id, userId, value) {
        const result = await query('UPDATE devices SET value = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [value, id, userId]);
        return result.rows[0] || null;
    },
    async delete(id, userId) {
        const result = await query('DELETE FROM devices WHERE id = $1 AND user_id = $2', [id, userId]);
        return (result.rowCount ?? 0) > 0;
    },
    async getPowerConsumption(userId) {
        const result = await query('SELECT name, power_consumption, is_on, icon_name FROM devices WHERE user_id = $1 ORDER BY power_consumption DESC', [userId]);
        return result.rows;
    },
};
//# sourceMappingURL=Device.js.map