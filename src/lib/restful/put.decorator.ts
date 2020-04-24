import { RequestHandler } from 'express';
import { define, METHODS } from '.';

export function Put(uri = '/', ...middlewares: RequestHandler[]): any {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function() {
            return originalMethod.apply(target, arguments);
        };
        define({ method: METHODS.PUT, uri, middlewares, target, propertyKey });
    };
}
