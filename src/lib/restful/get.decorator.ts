import { RequestHandler } from 'express';
import { HttpRouteMetadata, METHODS, registerHttpRoute } from '.';
export function HttpGet(endpoint = '/', ...middlewares: RequestHandler[]) {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        registerHttpRoute(new HttpRouteMetadata(
            target.constructor,
            target[propertyKey],
            endpoint,
            METHODS.GET,
            middlewares
        ));
    };
}
