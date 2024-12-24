// src/_core/helper/create-router-path.ts
import * as express from 'express';

// src/_core/helper/create-router-path.ts
export function createRouter(filename: string) {
    const router = express.Router();
    
    // Store source on the router itself
    (router as any).__source = filename;
    
    // Wrap route methods to store source
    ['get', 'post', 'put', 'delete', 'patch'].forEach(method => {
        const originalMethod = (router as any)[method];
        (router as any)[method] = function(path: string, ...handlers: any[]) {
            // Store source on each handler and the route
            handlers.forEach(handler => {
                if (typeof handler === 'function') {
                    handler.__source = filename;
                    if (handler.original) {
                        handler.original.__source = filename;
                    }
                }
            });
            const route = originalMethod.call(this, path, ...handlers);
            route.__source = filename;
            return route;
        };
    });
    
    return router;
}