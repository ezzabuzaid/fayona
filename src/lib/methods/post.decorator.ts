import { RequestHandler } from 'express';
import { define, METHODS } from '.';

export function Post(uri = '/', ...middlewares: RequestHandler[]): any {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            console.log('wrapped function: before invoking ' + propertyKey);
            const result = originalMethod.apply(this, args);
            console.log('wrapped function: after invoking ' + propertyKey);
            return result;
        };
        define({ method: METHODS.POST, uri, middlewares, target, propertyKey });
    };
}
