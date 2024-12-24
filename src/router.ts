import express, { Router } from 'express';
import { routeLoggerMiddleware } from './middleware';
import { RouteHandlerWithMetadata } from './types';

/**
 * Creates a custom Express router with metadata and logging capabilities.
 * @param filename - The source file name for the router.
 * @returns Express Router
 */
export function createRouter(filename: string, dirname: string): Router {
    const router = express.Router();

    // Store the source on the router itself
    (router as any).__source = filename;

    ['get', 'post', 'put', 'delete', 'patch'].forEach(method => {
        const originalMethod = (router as any)[method];
        (router as any)[method] = function (path: string, ...handlers: any[]) {
            handlers.forEach(handler => {
                if (typeof handler === 'function') {
                    (handler as RouteHandlerWithMetadata).__source = filename;
                    (handler as RouteHandlerWithMetadata).__name = `${method.toUpperCase()} ${path}`;
                    (handler as RouteHandlerWithMetadata).middleware = handler.middleware || [];
                }
            });

            // Add routeLoggerMiddleware before handlers
            const route = originalMethod.call(this, path, routeLoggerMiddleware, ...handlers);
            
            // Ensure source is set on the route itself
            if (route && typeof route === 'object') {
                (route as any).__source = filename;
                // Also set source on the route's stack
                if (route.stack && Array.isArray(route.stack)) {
                    route.stack.forEach(layer => {
                        if (layer && typeof layer === 'object') {
                            (layer as any).__source = filename;
                            if (layer.handle && typeof layer.handle === 'function') {
                                (layer.handle as any).__source = filename;
                            }
                        }
                    });
                }
            }
            
            return route;
        };
    });

    return router;
}