import { query } from '../config/database.js';
export const RoomModel = {
    async findAllByUser(userId) {
        const result = await query(`SELECT r.*,
        COUNT(d.id)::int AS device_count,
        COUNT(CASE WHEN d.is_on = true THEN 1 END)::int AS active_devices
      FROM rooms r
      LEFT JOIN devices d ON d.room_id = r.id
      WHERE r.user_id = $1
      GROUP BY r.id
      ORDER BY r.created_at ASC`, [userId]);
        return result.rows;
    },
    async findById(id, userId) {
        const result = await query('SELECT * FROM rooms WHERE id = $1 AND user_id = $2', [id, userId]);
        return result.rows[0] || null;
    },
    async create(userId, name, icon) {
        const result = await query('INSERT INTO rooms (user_id, name, icon) VALUES ($1, $2, $3) RETURNING *', [userId, name, icon || null]);
        return result.rows[0];
    },
    async update(id, userId, data) {
        const fields = [];
        const values = [];
        let paramIndex = 1;
        if (data.name) {
            fields.push(`name = $${paramIndex++}`);
            values.push(data.name);
        }
        if (data.icon !== undefined) {
            fields.push(`icon = $${paramIndex++}`);
            values.push(data.icon);
        }
        if (fields.length === 0)
            return this.findById(id, userId);
        values.push(id, userId);
        const result = await query(`UPDATE rooms SET ${fields.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex} RETURNING *`, values);
        return result.rows[0] || null;
    },
    async delete(id, userId) {
        const result = await query('DELETE FROM rooms WHERE id = $1 AND user_id = $2', [id, userId]);
        return (result.rowCount ?? 0) > 0;
    },
};
//# sourceMappingURL=Room.js.map