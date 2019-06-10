import { RequestHandler } from 'express';
import 'reflect-metadata';
import { method } from './method';

export function Get(uri = '/', ...middlewares: RequestHandler[]): any {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const _method = descriptor.value;
        descriptor.value = function () {
            return _method.apply(target, arguments);
        };
        const meta = method('get', uri, middlewares, target, propertyKey);
        Reflect.defineMetadata(`${uri}get`, meta, target.constructor);
    };
}
