import express from 'express';
export declare class RouteDisplay {
    private app;
    private routes;
    constructor(app: express.Express);
    private formatMethod;
    private getSourcePath;
    private parseRoutes;
    displayRoutes(): void;
}
//# sourceMappingURL=route-display.d.ts.map