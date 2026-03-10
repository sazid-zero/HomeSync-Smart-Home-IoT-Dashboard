import { Request, Response, NextFunction } from 'express';
export declare const deviceController: {
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getByRoom(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggle(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateValue(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPowerConsumption(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=deviceController.d.ts.map