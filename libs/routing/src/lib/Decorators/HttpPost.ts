import {
  ArgumentNullException,
  CoreInjector,
  HttpEndpointMetadata,
  METHODS,
  Metadata,
} from '@fayona/core';
import { RequestHandler } from 'express';

import { HttpResponse } from '../Response';

export function HttpPost(
  endpoint = '/',
  ...middlewares: RequestHandler[]
): MethodDecorator {
  return function (
    target: Record<string, any>,
    propertyKey,
    descriptor: PropertyDescriptor
  ) {
    const returnType = Reflect.getMetadata(
      'design:returntype',
      target,
      propertyKey
    );

    if (HttpResponse !== returnType) {
      throw new ArgumentNullException(
        `The return type of ${propertyKey.toString()} is not HttpResponse.`
      );
    }

    const metadata = CoreInjector.GetRequiredService(Metadata);
    metadata.RegisterHttpEndpoint(
      new HttpEndpointMetadata(
        target.constructor,
        target[propertyKey as string],
        endpoint,
        METHODS.POST,
        middlewares
      )
    );
  };
}
