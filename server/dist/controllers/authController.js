import { z } from 'zod';
import { UserModel } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';
const registerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
export const authController = {
    async register(req, res, next) {
        try {
            const { name, email, password } = registerSchema.parse(req.body);
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                res.status(409).json({ error: 'Email already registered' });
                return;
            }
            const passwordHash = await hashPassword(password);
            const user = await UserModel.create(name, email, passwordHash);
            const token = generateToken({ userId: user.id, email: user.email });
            res.status(201).json({ user, token });
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = loginSchema.parse(req.body);
            const user = await UserModel.findByEmail(email);
            if (!user) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }
            const isValid = await comparePassword(password, user.password_hash);
            if (!isValid) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }
            const token = generateToken({ userId: user.id, email: user.email });
            const { password_hash: _, ...publicUser } = user;
            res.json({ user: publicUser, token });
        }
        catch (error) {
            next(error);
        }
    },
    async me(req, res, next) {
        try {
            const user = await UserModel.findById(req.user.userId);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ user });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=authController.js.map