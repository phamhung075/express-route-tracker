import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to log route metadata.
 */
export function routeLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const routeName = req.route?.path || 'unknown';
    const method = req.method;
    const handlerSource = (req.route?.stack || [])
        .map((layer: any) => (layer.handle as any).__source || 'unknown')
        .join(', ');

    console.log(`[Route Log]: ${method} ${routeName} - Source: ${handlerSource}`);
    next();
}
