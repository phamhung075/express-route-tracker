import { Request, Response, NextFunction } from 'express';
import { HATEOASLink } from './hateoas.interface';

export type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;

export interface RouteHandlerWithMetadata extends RouteHandler {
    __source?: string;
    __name?: string;
    middleware?: RouteHandler[];
}