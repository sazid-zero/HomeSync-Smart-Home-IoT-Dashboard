import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

export const userController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserModel.findById(req.user!.userId);
      if (!user) { res.status(404).json({ error: 'User not found' }); return; }
      res.json({ user });
    } catch (error) { next(error); }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, avatar_url, theme_preference } = req.body;
      const user = await UserModel.updateProfile(req.user!.userId, { name, avatar_url, theme_preference });
      if (!user) { res.status(404).json({ error: 'User not found' }); return; }
      res.json({ user });
    } catch (error) { next(error); }
  },

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword || newPassword.length < 6) {
        res.status(400).json({ error: 'Invalid password. New password must be at least 6 characters.' });
        return;
      }
      const currentHash = await UserModel.getPasswordHash(req.user!.userId);
      if (!currentHash) { res.status(404).json({ error: 'User not found' }); return; }

      const isValid = await comparePassword(currentPassword, currentHash);
      if (!isValid) { res.status(401).json({ error: 'Current password is incorrect' }); return; }

      const newHash = await hashPassword(newPassword);
      await UserModel.updatePassword(req.user!.userId, newHash);
      res.json({ message: 'Password updated successfully' });
    } catch (error) { next(error); }
  },
};
