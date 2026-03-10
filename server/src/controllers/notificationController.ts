import { Request, Response, NextFunction } from 'express';
import { NotificationModel } from '../models/Notification.js';

export const notificationController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await NotificationModel.findAllByUser(req.user!.userId);
      const unreadCount = await NotificationModel.getUnreadCount(req.user!.userId);
      res.json({ notifications, unreadCount });
    } catch (error) { next(error); }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await NotificationModel.markAsRead((req.params.id as string), req.user!.userId);
      if (!success) { res.status(404).json({ error: 'Notification not found' }); return; }
      res.json({ message: 'Marked as read' });
    } catch (error) { next(error); }
  },

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationModel.markAllAsRead(req.user!.userId);
      res.json({ message: 'All notifications marked as read' });
    } catch (error) { next(error); }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await NotificationModel.delete((req.params.id as string), req.user!.userId);
      if (!deleted) { res.status(404).json({ error: 'Notification not found' }); return; }
      res.json({ message: 'Notification deleted' });
    } catch (error) { next(error); }
  },
};
