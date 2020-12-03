import { RequestHandler } from 'express';
import { HttpRouteMetadata, METHODS, registerHttpRoute } from './index';
export function HttpDelete(endpoint = '/', ...middlewares: RequestHandler[]): MethodDecorator {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        registerHttpRoute(new HttpRouteMetadata(
            target.constructor,
            target[propertyKey],
            endpoint,
            METHODS.DELETE,
            middlewares
        ));
    };
}
