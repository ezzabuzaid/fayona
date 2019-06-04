import { RequestHandler } from 'express';
import 'reflect-metadata';
import { method } from './method';
export function Delete(uri: string, ...middlewares: RequestHandler[]): any {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const _method = descriptor.value;
        descriptor.value = function() {
            return _method.apply(target, arguments);
        };
        const meta = method('delete', uri, middlewares, target, propertyKey);
        Reflect.defineMetadata(`${uri}delete`, meta, target.constructor);
    };
}
