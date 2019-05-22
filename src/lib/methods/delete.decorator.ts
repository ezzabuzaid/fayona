import { RouterMethodDecorator } from '@lib/typing';
import { ErrorHandling } from '@core/helpers';
import { AppUtils } from '@core/utils';
import { RequestHandler } from 'express';

export function Delete<T=any>(uri: string, ...middlewares: RequestHandler[]) {
    return function (target: RouterMethodDecorator & T, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;
        const instance: RouterMethodDecorator = target;
        descriptor.value = function () {
            //* any code here will be executed when the marked method get called 
            return method.apply(target, arguments);
        }

        // NOTE  since the method decorator called before the class decorator we have no access to any of
        // the method or properites that binded manually by the {Router} decorator
        // and setTimeout solved the problem
        setTimeout(() => {
            //* a way fix path to router slashes
            //* join router path and get path
            uri = AppUtils.joinPath(target.routeURI, '/', uri);

            //* assign the router
            instance.delete(uri, ErrorHandling.wrapRoute(...middlewares, function () {
                return target[propertyKey](...arguments);
            }));

        }, 0);
    }
}
