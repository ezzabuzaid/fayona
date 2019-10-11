import { RequestHandler, Router, RouterOptions } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';

export interface IRouterDecorationOption extends RouterOptions {
    middleware?: RequestHandler[] | RequestHandlerParams[];
}

export enum RouterProperties {
    RoutesPath = 'uri',
    ID = 'id',
}

export type RouterMethodDecorator = Router & { uri: string };

export interface IExpressRouter {
    router: RequestHandler;
    id: string;
    uri: string;
}

export interface IExpressInternal {
    __router: () => IExpressRouter;
}
