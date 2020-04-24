import { define } from './index';
import { RequestHandler } from 'express';

/**
 * intercept the incoming request
 */
export function Intercept(...middlewares: RequestHandler[]) {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            return originalMethod.apply(this, args);
        };
        define({ method: 'use' as any, uri: '/', middlewares, target, propertyKey });
    };
}
