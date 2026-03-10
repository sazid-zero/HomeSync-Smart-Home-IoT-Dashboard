import { Request, Response, NextFunction } from 'express';
export interface ApiError extends Error {
    statusCode?: number;
}
export declare function errorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction): void;
export declare function notFound(_req: Request, res: Response): void;
//# sourceMappingURL=errorHandler.d.ts.map