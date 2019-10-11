import { RequestHandler } from 'express';
import { define, METHODS } from '.';

export function Get(uri = '/', ...middlewares: RequestHandler[]) {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            const result = originalMethod.apply(this, args);
            return result;
        };
        define({ method: METHODS.GET, uri, middlewares, target, propertyKey });
    };
}
