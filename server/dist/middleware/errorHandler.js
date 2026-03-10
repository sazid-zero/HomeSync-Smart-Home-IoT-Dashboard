import { env } from '../config/env.js';
export function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 && env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;
    console.error(`[ERROR] ${statusCode}: ${err.message}`);
    if (env.NODE_ENV === 'development' && err.stack) {
        console.error(err.stack);
    }
    res.status(statusCode).json({
        error: message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}
export function notFound(_req, res) {
    res.status(404).json({ error: 'Route not found' });
}
//# sourceMappingURL=errorHandler.js.map