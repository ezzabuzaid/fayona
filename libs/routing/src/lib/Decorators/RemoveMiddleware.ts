import {
  CoreInjector,
  HttpEndpointMiddlewareMetadata,
  Metadata,
} from '@fayona/core';

export function RemoveMiddleware(
  middleware: (...args: any[]) => any
): MethodDecorator {
  return function (
    target: Record<string, any>,
    propertyKey,
    descriptor: PropertyDescriptor
  ) {
    // const metadata = CoreInjector.GetRequiredService(Metadata);
    // metadata.RegisterHttpEndpointMiddleware(
    //   new HttpEndpointMiddlewareMetadata(
    //     middleware,
    //     target.constructor,
    //     target[propertyKey as string]
    //   )
    // );
  };
}
