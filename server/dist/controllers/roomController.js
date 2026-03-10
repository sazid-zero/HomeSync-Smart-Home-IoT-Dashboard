import { RoomModel } from '../models/Room.js';
export const roomController = {
    async getAll(req, res, next) {
        try {
            const rooms = await RoomModel.findAllByUser(req.user.userId);
            res.json({ rooms });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const room = await RoomModel.findById(req.params.id, req.user.userId);
            if (!room) {
                res.status(404).json({ error: 'Room not found' });
                return;
            }
            res.json({ room });
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const { name, icon } = req.body;
            const room = await RoomModel.create(req.user.userId, name, icon);
            res.status(201).json({ room });
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const room = await RoomModel.update(req.params.id, req.user.userId, req.body);
            if (!room) {
                res.status(404).json({ error: 'Room not found' });
                return;
            }
            res.json({ room });
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const deleted = await RoomModel.delete(req.params.id, req.user.userId);
            if (!deleted) {
                res.status(404).json({ error: 'Room not found' });
                return;
            }
            res.json({ message: 'Room deleted' });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=roomController.js.map