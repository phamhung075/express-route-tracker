"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("./middleware");
/**
 * Creates a custom Express router with metadata and logging capabilities.
 * @param filename - The source file name for the router.
 * @returns Express Router
 */
function createRouter(filename) {
    const router = express_1.default.Router();
    // Store the source on the router itself
    router.__source = filename;
    ['get', 'post', 'put', 'delete', 'patch'].forEach(method => {
        const originalMethod = router[method];
        router[method] = function (path, ...handlers) {
            handlers.forEach(handler => {
                if (typeof handler === 'function') {
                    handler.__source = filename;
                    handler.__name = `${method.toUpperCase()} ${path}`;
                    handler.middleware = handler.middleware || [];
                }
            });
            // Add routeLoggerMiddleware before handlers
            const route = originalMethod.call(this, path, middleware_1.routeLoggerMiddleware, ...handlers);
            route.__source = filename;
            return route;
        };
    });
    return router;
}
