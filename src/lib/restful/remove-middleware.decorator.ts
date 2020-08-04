import { HttpRouteMiddlewareMetadata, registerMiddleware } from '.';

export function RemoveMiddleware(middleware: (...args: any[]) => any) {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        registerMiddleware(
            new HttpRouteMiddlewareMetadata(
                middleware,
                target.constructor,
                target[propertyKey],
            )
        );
    };
}
