import {
  CoreInjector,
  HttpEndpointMetadata,
  HttpEndpointMiddlewareMetadata,
  HttpRouteMetadata,
  IsNullOrEmpty,
  sortBy,
} from '@fayona/core';
import { Metadata } from '@fayona/core';
import { Request, RequestHandler, Router as expressRouter } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import * as path from 'path';

import { IRouterDecorationOption } from '../IRouterDecorationOption';

/**
 * When no name is provided the name will autamatically be the name of the route,
 * which by convention is the route class name minus the "Controller" suffix.
 * ex., the Controller class name is ExampleController, so the Route name is "example".
 */
export function Route(
  endpoint?: string,
  options: IRouterDecorationOption = {}
): any {
  return function (constructor: Function): ReturnType<ClassDecorator> {
    if (!constructor.name.endsWith('Controller')) {
      throw new Error(
        `${constructor.name} is not valid name, please consider suffixing your class with Controller`
      );
    }

    const metadata = CoreInjector.GetRequiredService(Metadata);
    const router = expressRouter(options);

    if (Array.isArray(options.Children) && options.Children.length > 0) {
      options.Children.forEach((childController) => {
        const childRoute = metadata.GetHttpRoute(
          (route) => route.controller === childController
        );
        if (childRoute) {
          router.use(childRoute.GetPath(), childRoute.GetRouter());
        } else {
          throw new Error(`Cannot find @Route for ${childController.name}`);
        }
      });
    }
    // TODO: Don't add child controller as standalone controller

    metadata.RegisterHttpRoute(
      new HttpRouteMetadata(
        constructor,
        router,
        NormalizeEndpoint(constructor, endpoint ?? '/')
      )
    );
    CoreInjector.AddScoped(constructor as any);

    const { endpoints } = metadata.GetHttpRoute(
      (item) => item.controller === constructor
    );

    // sort endpoint so paths like /:id will always be at the end
    [...endpoints]
      .sort(sortBy('path', true))
      .forEach((httpEndpointMetadata) => {
        const normalizedEndpoint = path.join('/', httpEndpointMetadata.path!);

        router[httpEndpointMetadata.method!](
          normalizedEndpoint,
          (req, res, next) => next()
        );
      });

    return constructor;
  };
}

function NormalizeEndpoint(target: Function, endpoint: string): string {
  // TODO: add options to transform the name to either singular, plural or as is
  let mappedValue = endpoint;
  if (IsNullOrEmpty(endpoint)) {
    mappedValue = target.name
      .substring(target.name.lastIndexOf('Controller'), -target.name.length)
      .toLowerCase();
  }
  return path.normalize(path.join('/', mappedValue, '/'));
}

function PopulateRouteMiddlewares(
  listRemoveEndpointMiddlewareMetadata: HttpEndpointMiddlewareMetadata[],
  parentMiddlewares?: RequestHandler[] | RequestHandlerParams[]
): RequestHandlerParams[] {
  const clonedParentMiddlewares = parentMiddlewares?.slice(0) ?? [];
  const middlewares = listRemoveEndpointMiddlewareMetadata.map(
    (endpointMiddleware) => endpointMiddleware.middleware.toString()
  );
  const index = clonedParentMiddlewares.findIndex((parentMiddleware) =>
    middlewares.includes(parentMiddleware.toString())
  );
  if (index !== -1) {
    clonedParentMiddlewares.splice(index, 1);
  }
  return clonedParentMiddlewares;
}
