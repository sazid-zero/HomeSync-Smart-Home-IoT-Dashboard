import { NotificationModel } from '../models/Notification.js';
export const notificationController = {
    async getAll(req, res, next) {
        try {
            const notifications = await NotificationModel.findAllByUser(req.user.userId);
            const unreadCount = await NotificationModel.getUnreadCount(req.user.userId);
            res.json({ notifications, unreadCount });
        }
        catch (error) {
            next(error);
        }
    },
    async markAsRead(req, res, next) {
        try {
            const success = await NotificationModel.markAsRead(req.params.id, req.user.userId);
            if (!success) {
                res.status(404).json({ error: 'Notification not found' });
                return;
            }
            res.json({ message: 'Marked as read' });
        }
        catch (error) {
            next(error);
        }
    },
    async markAllAsRead(req, res, next) {
        try {
            await NotificationModel.markAllAsRead(req.user.userId);
            res.json({ message: 'All notifications marked as read' });
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const deleted = await NotificationModel.delete(req.params.id, req.user.userId);
            if (!deleted) {
                res.status(404).json({ error: 'Notification not found' });
                return;
            }
            res.json({ message: 'Notification deleted' });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=notificationController.js.map