import { RequestHandler } from 'express';
import { define, METHODS } from '.';

export function HttpPatch(uri = '/', ...middlewares: RequestHandler[]) {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            return originalMethod.apply(this, args);
        };
        define({ method: METHODS.PATCH, uri, middlewares, target, propertyKey });
    };
}
