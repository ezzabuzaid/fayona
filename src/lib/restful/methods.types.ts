import { RequestHandler, RouterOptions, Router } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';

export interface IRouterDecorationOption extends RouterOptions {
    middleware?: RequestHandler[] | RequestHandlerParams[];
    children?: any[];
}

export interface IExpressRouter {
    router: Router;
    id: string;
    uri: string;
}

export interface IExpressInternal {
    __router: () => IExpressRouter;
}
