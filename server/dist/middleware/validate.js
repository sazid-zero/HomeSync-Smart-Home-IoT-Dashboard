import { ZodError } from 'zod';
export function validate(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                res.status(400).json({ error: 'Validation failed', details: errors });
                return;
            }
            next(error);
        }
    };
}
//# sourceMappingURL=validate.js.map