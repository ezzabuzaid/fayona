import { RequestHandler } from 'express';
import { define, METHODS } from '.';

export function Patch(uri = '/', ...middlewares: RequestHandler[]): any {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const _method = descriptor.value;
        descriptor.value = function() {
            return _method.apply(target, arguments);
        };
        define({ method: METHODS.PATCH, uri, middlewares, target, propertyKey });
    };
}
