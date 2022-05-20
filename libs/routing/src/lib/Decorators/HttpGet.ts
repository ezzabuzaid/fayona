import { HttpEndpointMetadata, METHODS, Metadata } from '@fayona/core';
import { RequestHandler } from 'express';
import { Injector } from 'tiny-injector';

export function HttpGet(
  endpoint: string = '/',
  ...middlewares: RequestHandler[]
): MethodDecorator {
  return function (
    target: Record<string, any>,
    propertyKey,
    descriptor: PropertyDescriptor
  ) {
    // FIXME: to be enabled as build step

    // const returnType = Reflect.getMetadata(
    //   'design:returntype',
    //   target,
    //   propertyKey
    // );

    // if (HttpResponse !== returnType) {
    //   throw new ArgumentNullException(
    //     `The return type of ${propertyKey.toString()} is not HttpResponse.`
    //   );
    // }

    const metadata = Injector.GetRequiredService(Metadata);
    metadata.RegisterHttpEndpoint(
      new HttpEndpointMetadata(
        target.constructor,
        target[propertyKey as string],
        endpoint,
        METHODS.GET,
        middlewares
      )
    );
  };
}
