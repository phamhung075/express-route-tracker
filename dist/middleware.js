"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeLoggerMiddleware = routeLoggerMiddleware;
/**
 * Middleware to log route metadata.
 */
function routeLoggerMiddleware(req, res, next) {
    var _a, _b;
    const routeName = ((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || 'unknown';
    const method = req.method;
    const handlerSource = (((_b = req.route) === null || _b === void 0 ? void 0 : _b.stack) || [])
        .map((layer) => layer.handle.__source || 'unknown')
        .join(', ');
    console.log(`[Route Log]: ${method} ${routeName} - Source: ${handlerSource}`);
    next();
}
