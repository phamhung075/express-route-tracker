//src\_core\helper\route-display\route-display.index.ts

import Table from 'cli-table3';
import { blue, cyan, gray, green, magenta, red, white } from 'colorette';
import express from 'express';

interface RouteInfo {
    method: string;
    path: string;
    sourcePath: string;
}

export class RouteDisplay {
    private app: express.Express;
    private routes: RouteInfo[] = [];

    constructor(app: express.Express) {
        this.app = app;
    }

    private formatMethod(method: string): string {
        const colors: Record<string, (text: string) => string> = {
            'GET': green,
            'POST': blue,
            'PUT': magenta,
            'DELETE': red,
            'PATCH': cyan
        };
        return colors[method]?.(method.toUpperCase()) || method;
    }

    private getSourcePath(route: any): string {
        return route.__source || 
               route.stack?.[0]?.handle?.__source || 
               route.stack?.[0]?.handle?.original?.__source || 
               'unknown';
    }

    private parseRoutes(layer: any, basePath: string = ''): void {
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
        } else if (layer.name === 'router') {
            // This is a nested router
            const prefix = layer.regexp?.source
                ?.replace('\\/?(?=\\/|$)', '')
                ?.replace(/\\\//g, '/')
                ?.replace(/^\^/, '')
                ?.replace(/\$/, '') || '';
                
            // Parse nested routes
            layer.handle.stack.forEach((nestedLayer: any) => {
                // console.log('Nested Layer:', nestedLayer);
                this.parseRoutes(nestedLayer, prefix);
            });
        }
    }

    public displayRoutes(): void {
        // Parse all routes
        this.app._router.stack.forEach((layer:any) => this.parseRoutes(layer));

        if (this.routes.length === 0) {
            console.log('\nNo routes found. Make sure routes are properly mounted on the Express app.');
            return;
        }

        // Sort routes by path and method
        this.routes.sort((a, b) => {
            const pathCompare = a.path.localeCompare(b.path);
            if (pathCompare !== 0) return pathCompare;
            return a.method.localeCompare(b.method);
        });

        const table = new Table({
            head: ['Method', 'Path', 'Source'].map(h => white(h)),
            style: {
                head: [],
                border: []
            }
        });

        this.routes.forEach(route => {
            table.push([
                this.formatMethod(route.method),
                route.path,
                gray(route.sourcePath)
            ]);
        });

        console.log('\nAPI Routes:');
        console.log(table.toString());
        console.log(`\nTotal routes: ${this.routes.length}\n`);
    }
}