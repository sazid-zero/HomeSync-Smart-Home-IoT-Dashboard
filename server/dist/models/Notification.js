import { query } from '../config/database.js';
export const NotificationModel = {
    async findAllByUser(userId, limit = 50) {
        const result = await query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2', [userId, limit]);
        return result.rows;
    },
    async getUnreadCount(userId) {
        const result = await query('SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND is_read = false', [userId]);
        return result.rows[0]?.count || 0;
    },
    async create(userId, title, message, type) {
        const result = await query('INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4) RETURNING *', [userId, title, message, type]);
        return result.rows[0];
    },
    async markAsRead(id, userId) {
        const result = await query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2', [id, userId]);
        return (result.rowCount ?? 0) > 0;
    },
    async markAllAsRead(userId) {
        await query('UPDATE notifications SET is_read = true WHERE user_id = $1', [userId]);
    },
    async delete(id, userId) {
        const result = await query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [id, userId]);
        return (result.rowCount ?? 0) > 0;
    },
    async deleteAllByUser(userId) {
        await query('DELETE FROM notifications WHERE user_id = $1', [userId]);
    },
};
//# sourceMappingURL=Notification.js.map