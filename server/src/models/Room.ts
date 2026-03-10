import { query } from '../config/database.js';

export interface Room {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  created_at: Date;
}

export interface RoomWithStats extends Room {
  device_count: number;
  active_devices: number;
}

export const RoomModel = {
  async findAllByUser(userId: string): Promise<RoomWithStats[]> {
    const result = await query(
      `SELECT r.*,
        COUNT(d.id)::int AS device_count,
        COUNT(CASE WHEN d.is_on = true THEN 1 END)::int AS active_devices
      FROM rooms r
      LEFT JOIN devices d ON d.room_id = r.id
      WHERE r.user_id = $1
      GROUP BY r.id
      ORDER BY r.created_at ASC`,
      [userId]
    );
    return result.rows;
  },

  async findById(id: string, userId: string): Promise<Room | null> {
    const result = await query('SELECT * FROM rooms WHERE id = $1 AND user_id = $2', [id, userId]);
    return result.rows[0] || null;
  },

  async create(userId: string, name: string, icon?: string): Promise<Room> {
    const result = await query(
      'INSERT INTO rooms (user_id, name, icon) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, icon || null]
    );
    return result.rows[0];
  },

  async update(id: string, userId: string, data: { name?: string; icon?: string }): Promise<Room | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.name) { fields.push(`name = $${paramIndex++}`); values.push(data.name); }
    if (data.icon !== undefined) { fields.push(`icon = $${paramIndex++}`); values.push(data.icon); }

    if (fields.length === 0) return this.findById(id, userId);

    values.push(id, userId);
    const result = await query(
      `UPDATE rooms SET ${fields.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await query('DELETE FROM rooms WHERE id = $1 AND user_id = $2', [id, userId]);
    return (result.rowCount ?? 0) > 0;
  },
};
