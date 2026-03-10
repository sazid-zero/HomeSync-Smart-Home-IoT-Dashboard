import { verifyToken } from '../utils/jwt.js';
export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
}
//# sourceMappingURL=auth.js.map