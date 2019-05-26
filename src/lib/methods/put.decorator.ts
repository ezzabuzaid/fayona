import { RequestHandler } from 'express';
import { method } from './method';
export function Put(uri: string, ...middlewares: RequestHandler[]): any {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const _method = descriptor.value;
        descriptor.value = function () {
            //* any code here will be executed when the marked method get called 
            return _method.apply(target, arguments);
        }
        setTimeout(() => {
            method('put', target, uri, middlewares, propertyKey);
        }, 0);
    }
}

