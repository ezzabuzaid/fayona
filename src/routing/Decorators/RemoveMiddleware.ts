import { Injector } from '@lib/dependency-injection';
import { HttpRemoveEndpointMiddlewareMetadata } from '../HttpRemoveEndpointMiddlewareMetadata';
import { Metadata } from '../Metadata';

export function RemoveMiddleware(middleware: (...args: any[]) => any) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const metadata = Injector.GetRequiredService(Metadata);
        metadata.registerHttpEndpointMiddleware(
            new HttpRemoveEndpointMiddlewareMetadata(
                middleware,
                target.constructor,
                target[propertyKey],
            )
        );
    };
}
