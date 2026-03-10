import { Request, Response, NextFunction } from 'express';
import { DeviceModel } from '../models/Device.js';

export const deviceController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const devices = await DeviceModel.findAllByUser(req.user!.userId);
      res.json({ devices });
    } catch (error) { next(error); }
  },

  async getByRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const devices = await DeviceModel.findByRoom((req.params.roomId as string), req.user!.userId);
      res.json({ devices });
    } catch (error) { next(error); }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const device = await DeviceModel.findById((req.params.id as string), req.user!.userId);
      if (!device) { res.status(404).json({ error: 'Device not found' }); return; }
      res.json({ device });
    } catch (error) { next(error); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const device = await DeviceModel.create({ ...req.body, user_id: req.user!.userId });
      // Emit socket event
      const io = req.app.get('io');
      if (io) io.to(req.user!.userId).emit('device:create', device);
      res.status(201).json({ device });
    } catch (error) { next(error); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const device = await DeviceModel.update((req.params.id as string), req.user!.userId, req.body);
      if (!device) { res.status(404).json({ error: 'Device not found' }); return; }
      const io = req.app.get('io');
      if (io) io.to(req.user!.userId).emit('device:update', device);
      res.json({ device });
    } catch (error) { next(error); }
  },

  async toggle(req: Request, res: Response, next: NextFunction) {
    try {
      const device = await DeviceModel.toggle((req.params.id as string), req.user!.userId);
      if (!device) { res.status(404).json({ error: 'Device not found' }); return; }
      const io = req.app.get('io');
      if (io) io.to(req.user!.userId).emit('device:toggle', device);
      res.json({ device });
    } catch (error) { next(error); }
  },

  async updateValue(req: Request, res: Response, next: NextFunction) {
    try {
      const { value } = req.body;
      const device = await DeviceModel.updateValue((req.params.id as string), req.user!.userId, value);
      if (!device) { res.status(404).json({ error: 'Device not found' }); return; }
      const io = req.app.get('io');
      if (io) io.to(req.user!.userId).emit('device:update', device);
      res.json({ device });
    } catch (error) { next(error); }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await DeviceModel.delete((req.params.id as string), req.user!.userId);
      if (!deleted) { res.status(404).json({ error: 'Device not found' }); return; }
      const io = req.app.get('io');
      if (io) io.to(req.user!.userId).emit('device:delete', { id: (req.params.id as string) });
      res.json({ message: 'Device deleted' });
    } catch (error) { next(error); }
  },

  async getPowerConsumption(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DeviceModel.getPowerConsumption(req.user!.userId);
      res.json({ devices: data });
    } catch (error) { next(error); }
  },
};
