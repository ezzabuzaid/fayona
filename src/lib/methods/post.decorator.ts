import { RequestHandler } from 'express';
import { define, METHODS } from '.';

export function Post(uri = '/', ...middlewares: RequestHandler[] ): any {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            const result = originalMethod.apply(this, args);
            return result;
        };
        define({ method: METHODS.POST, uri, middlewares, target, propertyKey });
    };
}
