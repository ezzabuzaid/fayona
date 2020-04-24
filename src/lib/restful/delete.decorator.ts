import { RequestHandler } from 'express';
import { define, METHODS } from '.';

export function Delete(uri = '/', ...middlewares: RequestHandler[]): any {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function() {
            return originalMethod.apply(target, arguments);
        };
        define({ method: METHODS.DELETE, uri, middlewares, target, propertyKey });
    };
}
