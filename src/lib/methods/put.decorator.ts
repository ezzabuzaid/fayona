import { RequestHandler } from 'express';
import 'reflect-metadata';
import { method } from './method';
export function Put(uri: string, ...middlewares: RequestHandler[]): any {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const _method = descriptor.value;
        descriptor.value = function() {
            // * any code here will be executed when the marked method get called
            return _method.apply(target, arguments);
        };
        const meta = method('put', uri, middlewares, target, propertyKey);
        Reflect.defineMetadata(`${uri}put`, meta, target.constructor);

    };
}
