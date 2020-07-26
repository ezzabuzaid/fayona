import { RequestHandler } from 'express';
import { HttpRouteMetadata, METHODS, registerHttpRoute } from '.';

export function HttpPost(endpoint = '/', ...middlewares: RequestHandler[]) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        registerHttpRoute(new HttpRouteMetadata(
            target[propertyKey],
            endpoint,
            METHODS.POST,
            target.constructor.name,
            middlewares
        ));
    };
}
