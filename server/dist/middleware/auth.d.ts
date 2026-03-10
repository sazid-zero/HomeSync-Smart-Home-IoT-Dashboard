import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../utils/jwt.js';
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare function authenticate(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map