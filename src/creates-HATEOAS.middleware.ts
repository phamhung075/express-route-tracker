import { Request, Response, NextFunction, Router } from 'express';
import { HATEOASOptions, HATEOASLinks } from './hateoas.interface';


export function createHATEOASMiddleware(router: Router, options: HATEOASOptions = { autoIncludeSameRoute: false }) {
    return function hateoasMiddleware(req: Request, res: Response, next: NextFunction) {
        const originalJson = res.json;
        const baseUrl = options.baseUrl || '';
        
        // Get the source file from the router
        const sourceFile = (router as any).__source;
        // console.log('Router source:', sourceFile);
        
        if (!sourceFile) {
            console.warn('No source file found on router');
            next();
            return;
        }
        
        // Log the router structure for debugging
        // console.log('Router stack size:', (router as any).stack.length);
        // console.log('Router prototype chain:', Object.getPrototypeOf(router));

        // Collect all routes from the same source file
        const routes = collectRoutesFromSameSource(router, sourceFile);

        res.json = function(body: any) {
            if (body && typeof body === 'object') {
                const links: HATEOASLinks = {
                    self: {
                        rel: 'self',
                        href: `${baseUrl}${req.originalUrl}`,
                        method: req.method as any
                    }
                };

                // Add pagination links if enabled and pagination data exists
                if (options.includePagination && body.pagination) {
                    const { currentPage, totalPages } = body.pagination;
                    const baseLink = `${baseUrl}${req.path}`;

                    if (totalPages > 1) {
                        links.first = {
                            rel: 'first',
                            href: `${baseLink}?page=1`,
                            method: 'GET'
                        };

                        if (currentPage > 1) {
                            links.prev = {
                                rel: 'prev',
                                href: `${baseLink}?page=${currentPage - 1}`,
                                method: 'GET'
                            };
                        }

                        if (currentPage < totalPages) {
                            links.next = {
                                rel: 'next',
                                href: `${baseLink}?page=${currentPage + 1}`,
                                method: 'GET'
                            };
                        }

                        links.last = {
                            rel: 'last',
                            href: `${baseLink}?page=${totalPages}`,
                            method: 'GET'
                        };
                    }
                }

                // Add related route links from the same file
                if (options.autoIncludeSameRoute !== false) {
                    // Extract base path from the current request
                    const basePath = req.baseUrl || '';
                    // console.log('Base path:', basePath);
                    
                    routes.forEach(route => {
                        // Generate the actual route path with parameters
                        const routePath = route.path.replace(/:[^/]+/g, (match) => {
                            const param = match.substring(1);
                            return req.params[param] || body[param] || match;
                        });

                        // Normalize paths for comparison
                        const normalizedCurrentPath = req.route ? normalizeRoutePath(req.route.path) : '';
                        const normalizedRoutePath = normalizeRoutePath(route.path);
                        
                        // Determine if this is the current route
                        const isCurrentRoute = (
                            route.method.toUpperCase() === req.method &&
                            normalizedCurrentPath === normalizedRoutePath
                        );

                        // Include the route if autoIncludeSameRoute is true or it's not the current route
                        if (options.autoIncludeSameRoute === true || !isCurrentRoute) {
                            const linkName = generateRelationship(route.method, route.path);
                            links[linkName] = {
                                title: `${route.method.toUpperCase()} ${route.path}`,
                                rel: linkName,
                                href: `${baseUrl}${basePath}${routePath}`,
                                method: route.method.toUpperCase() as any,
                            };
                        }
                    });
                }

                // Add custom links if defined
                if (options.customLinks) {
                    Object.entries(options.customLinks).forEach(([key, generator]) => {
                        const customLink = generator(req as any);
                        if (customLink) {
                            links[key] = customLink;
                        }
                    });
                }

                // Add links to the response
                body.links = links;
            }

            return originalJson.call(this, body);
        };

        next();
    };
}

/**
 * Collects all routes from the same source file
 */
function collectRoutesFromSameSource(router: Router, sourceFile: string) {
    const routes: Array<{ method: string; path: string }> = [];
    const stack = (router as any).stack;

    // console.log('Source file:', sourceFile);
    // console.log('Stack length:', stack.length);

    stack.forEach((layer: any) => {
        // If this layer has a route, include it (since we're already working with the correct router)
        if (layer.route) {
            const routePath = layer.route.path;
            const routeMethods = layer.route.methods;

            // console.log('Found route:', {
            //     path: routePath,
            //     methods: routeMethods
            // });

            Object.keys(routeMethods).forEach(method => {
                routes.push({
                    method: method,
                    path: routePath
                });
            });
        }
    });

    // console.log('Collected routes:', routes);
    return routes;
}

/**
 * Normalizes a route path for comparison by:
 * 1. Removing trailing slashes
 * 2. Replacing parameter names with placeholder
 * @param path The route path to normalize
 */
function normalizeRoutePath(path: string): string {
    return path
        .replace(/\/$/, '') // Remove trailing slash
        .replace(/:[^/]+/g, ':param') // Replace all parameters with a standard placeholder
        .replace(/^\//, ''); // Remove leading slash
}

/**
 * Generates a meaningful relationship name for a link based on the HTTP method and path
 */
function generateRelationship(method: string, path: string): string {
    // Common RESTful relationships
    if (path === '/' || path === '') {
        switch (method.toLowerCase()) {
            case 'get': return 'collection';
            case 'post': return 'create';
            default: return method.toLowerCase();
        }
    }

    if (path.includes(':id')) {
        switch (method.toLowerCase()) {
            case 'get': return 'item';
            case 'put': return 'update';
            case 'delete': return 'delete';
            case 'patch': return 'partial-update';
            default: return method.toLowerCase();
        }
    }

    // For any other paths, create a semantic relationship
    const cleanPath = path.replace(/^\/|\/$/g, '')  // Remove leading/trailing slashes
                         .replace(/:/g, '')          // Remove colon from parameters
                         .replace(/\//g, '-');       // Replace slashes with dashes
    
    return `${method.toLowerCase()}-${cleanPath}`;
}