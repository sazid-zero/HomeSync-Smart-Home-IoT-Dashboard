import { query } from '../config/database.js';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'critical';
  is_read: boolean;
  created_at: Date;
}

export const NotificationModel = {
  async findAllByUser(userId: string, limit: number = 50): Promise<Notification[]> {
    const result = await query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  },

  async getUnreadCount(userId: string): Promise<number> {
    const result = await query(
      'SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    );
    return result.rows[0]?.count || 0;
  },

  async create(userId: string, title: string, message: string, type: 'warning' | 'info' | 'critical'): Promise<Notification> {
    const result = await query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, title, message, type]
    );
    return result.rows[0];
  },

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const result = await query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return (result.rowCount ?? 0) > 0;
  },

  async markAllAsRead(userId: string): Promise<void> {
    await query('UPDATE notifications SET is_read = true WHERE user_id = $1', [userId]);
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [id, userId]);
    return (result.rowCount ?? 0) > 0;
  },

  async deleteAllByUser(userId: string): Promise<void> {
    await query('DELETE FROM notifications WHERE user_id = $1', [userId]);
  },
};
