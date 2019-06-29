import { RequestHandler } from 'express';
import { define, METHODS } from '.';

export function Get(uri = '/', ...middlewares: RequestHandler[]): any {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const _method = descriptor.value;
        descriptor.value = function() {
            return _method.apply(target, arguments);
        };
        define({ method: METHODS.GET, uri, middlewares, target, propertyKey });
    };
}
