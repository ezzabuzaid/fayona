import { HttpRemoveRouteMiddlewareMetadata, registerMiddleware } from './index';

export function RemoveMiddleware(middleware: (...args: any[]) => any) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        registerMiddleware(
            new HttpRemoveRouteMiddlewareMetadata(
                middleware,
                target.constructor,
                target[propertyKey],
            )
        );
    };
}
