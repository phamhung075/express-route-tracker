"use strict";
//src\_core\helper\route-display\route-display.index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteDisplay = void 0;
const cli_table3_1 = __importDefault(require("cli-table3"));
const colorette_1 = require("colorette");
class RouteDisplay {
    constructor(app) {
        this.routes = [];
        this.app = app;
    }
    formatMethod(method) {
        var _a;
        const colors = {
            'GET': colorette_1.green,
            'POST': colorette_1.blue,
            'PUT': colorette_1.magenta,
            'DELETE': colorette_1.red,
            'PATCH': colorette_1.cyan
        };
        return ((_a = colors[method]) === null || _a === void 0 ? void 0 : _a.call(colors, method.toUpperCase())) || method;
    }
    getSourcePath(route) {
        var _a, _b, _c, _d, _e, _f, _g;
        return route.__source ||
            ((_c = (_b = (_a = route.stack) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.handle) === null || _c === void 0 ? void 0 : _c.__source) ||
            ((_g = (_f = (_e = (_d = route.stack) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.handle) === null || _f === void 0 ? void 0 : _f.original) === null || _g === void 0 ? void 0 : _g.__source) ||
            'unknown';
    }
    parseRoutes(layer, basePath = '') {
        var _a, _b, _c, _d, _e;
        console.log('Parsing routes...');
        console.log('Layer:', layer);
        if (layer.route) {
            // This is a route definition
            const route = layer.route;
            const methods = Object.keys(route.methods);
            methods.forEach(method => {
                this.routes.push({
                    method: method.toUpperCase(),
                    path: (basePath + route.path) || '/',
                    sourcePath: this.getSourcePath(route)
                });
            });
        }
        else if (layer.name === 'router') {
            // This is a nested router
            const prefix = ((_e = (_d = (_c = (_b = (_a = layer.regexp) === null || _a === void 0 ? void 0 : _a.source) === null || _b === void 0 ? void 0 : _b.replace('\\/?(?=\\/|$)', '')) === null || _c === void 0 ? void 0 : _c.replace(/\\\//g, '/')) === null || _d === void 0 ? void 0 : _d.replace(/^\^/, '')) === null || _e === void 0 ? void 0 : _e.replace(/\$/, '')) || '';
            // Parse nested routes
            layer.handle.stack.forEach((nestedLayer) => {
                // console.log('Nested Layer:', nestedLayer);
                this.parseRoutes(nestedLayer, prefix);
            });
        }
    }
    displayRoutes() {
        // Parse all routes
        this.app._router.stack.forEach((layer) => this.parseRoutes(layer));
        if (this.routes.length === 0) {
            console.log('\nNo routes found. Make sure routes are properly mounted on the Express app.');
            return;
        }
        // Sort routes by path and method
        this.routes.sort((a, b) => {
            const pathCompare = a.path.localeCompare(b.path);
            if (pathCompare !== 0)
                return pathCompare;
            return a.method.localeCompare(b.method);
        });
        const table = new cli_table3_1.default({
            head: ['Method', 'Path', 'Source'].map(h => (0, colorette_1.white)(h)),
            style: {
                head: [],
                border: []
            }
        });
        this.routes.forEach(route => {
            table.push([
                this.formatMethod(route.method),
                route.path,
                (0, colorette_1.gray)(route.sourcePath)
            ]);
        });
        console.log('\nAPI Routes:');
        console.log(table.toString());
        console.log(`\nTotal routes: ${this.routes.length}\n`);
    }
}
exports.RouteDisplay = RouteDisplay;
