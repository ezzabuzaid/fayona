import { Injector } from '@lib/dependency-injection';
import { RequestHandler } from 'express';
import { HttpEndpointMetadata } from '../HttpEndpointMetadata';
import { Metadata } from '../Metadata';
import { METHODS } from '../Methods';
export function HttpGet(endpoint: string | RegExp = '/', ...middlewares: RequestHandler[]): MethodDecorator {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const metadata = Injector.GetRequiredService(Metadata);
        metadata.registerHttpEndpoint(new HttpEndpointMetadata(
            target.constructor,
            target[propertyKey],
            endpoint,
            METHODS.GET,
            middlewares
        ));
    };
}
