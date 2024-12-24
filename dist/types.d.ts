import { Request, Response, NextFunction } from 'express';
export type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;
export interface RouteHandlerWithMetadata extends RouteHandler {
    __source?: string;
    __name?: string;
    middleware?: RouteHandler[];
}
//# sourceMappingURL=types.d.ts.map