import { Injector } from 'tiny-injector';
import { HttpRemoveEndpointMiddlewareMetadata } from '../HttpRemoveEndpointMiddlewareMetadata';
import { Metadata } from '../Metadata';

export function RemoveMiddleware(middleware: (...args: any[]) => any): MethodDecorator {
    return function (target: Record<string, any>, propertyKey, descriptor: PropertyDescriptor) {
        const metadata = Injector.GetRequiredService(Metadata);
        metadata.registerHttpEndpointMiddleware(
            new HttpRemoveEndpointMiddlewareMetadata(
                middleware,
                target.constructor,
                target[propertyKey as string],
            )
        );
    };
}
