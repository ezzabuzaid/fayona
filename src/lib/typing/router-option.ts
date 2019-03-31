import { RequestHandler, RouterOptions, Router } from "express";
import { RequestHandlerParams } from 'express-serve-static-core';


export interface RouterDecorationOption extends RouterOptions {
    middleware?:  RequestHandler[] | RequestHandlerParams[]
}

export enum RouterProperties {
    RoutesPath = 'routeUri',
    ID = 'id',
}

export type RouterMethodDecorator = Router & { routeUri: string }

