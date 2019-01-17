import { RequestHandler, RouterOptions, IRouterMatcher } from "express";
import { IRouterHandler, RequestHandlerParams, Router as expressRouter } from "express-serve-static-core";

export interface RouterDecorationOption extends RouterOptions {
    middleware?: MiddlewareType[]
}

export type MiddlewareType = RequestHandler | RequestHandlerParams;

interface RouterInterface<T> {
    instance?: T;
    router?: expressRouter;
    routesPath?: string;
}

type Optional<T> = { [P in keyof T]?: T[P] }
export type RouterDec<T> = Optional<RouterInterface<T>>;