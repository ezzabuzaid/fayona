import {
  CoreInjector,
  HttpEndpointMetadata,
  METHODS,
  Metadata,
} from '@fayona/core';
import { RequestHandler } from 'express';

export function HttpPatch(
  endpoint = '/',
  ...middlewares: RequestHandler[]
): MethodDecorator {
  return function (
    target: Record<string, any>,
    propertyKey,
    descriptor: PropertyDescriptor
  ) {
    const metadata = CoreInjector.GetRequiredService(Metadata);
    metadata.RegisterHttpEndpoint(
      new HttpEndpointMetadata(
        target.constructor,
        target[propertyKey as string],
        endpoint,
        METHODS.PATCH,
        middlewares
      )
    );
  };
}
