import { RequestHandler } from 'express';
import { HttpRouteMetadata, METHODS, registerHttpRoute } from '.';

export function HttpGet(endpoint = '/', ...middlewares: RequestHandler[]) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        registerHttpRoute(new HttpRouteMetadata(
            target[propertyKey],
            endpoint,
            METHODS.GET,
            target.constructor.name,
            middlewares
        ));
    };
}
