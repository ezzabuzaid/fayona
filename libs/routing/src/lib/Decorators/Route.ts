import {
  CoreInjector,
  HttpEndpointMetadata,
  HttpEndpointMiddlewareMetadata,
  HttpRouteMetadata,
  InvalidOperationException,
  IsNullOrEmpty,
  ParameterType,
  sortBy,
} from '@fayona/core';
import { Metadata } from '@fayona/core';
import { Request, RequestHandler, Router as expressRouter } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import * as path from 'path';

import { IRouterDecorationOption } from '../IRouterDecorationOption';
import { FromBodyModelBinding } from '../ModelBinding/FromBodyModelBinding';
import { FromHeaderModelBinding } from '../ModelBinding/FromHeaderModelBinding';
import { FromQueryModelBinding } from '../ModelBinding/FromQueryModelBinding';
import { FromRouteModelBinding } from '../ModelBinding/FromRouteModelBinding';
import { FromServiceModelBinding } from '../ModelBinding/FromServiceModelBinding';
import { HttpResponse } from '../Response';

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
        const normalizedEndpoint = path.join(
          NormalizeEndpoint(constructor, endpoint ?? '/'),
          '/',
          httpEndpointMetadata.path!
        );
        router[httpEndpointMetadata.method!](
          normalizedEndpoint,
          async (request, response, next): Promise<any> => {
            try {
              const controllerInstance = request.Locate(
                httpEndpointMetadata.controller
              );

              const endpointResponse = httpEndpointMetadata.handler!.apply(
                controllerInstance,
                await getBindings(request, httpEndpointMetadata)
              ) as unknown as HttpResponse;

              response
                .status(endpointResponse.StatusCode)
                .json(endpointResponse.ToJson());
              next();
            } catch (error) {
              next(error);
            }
          }
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

const getBindings = async (
  request: Request,
  httpEndpointMetadata: HttpEndpointMetadata
): Promise<any[]> => {
  const parameters: any[] = [];
  const endpointParameters = httpEndpointMetadata.Parameters.reverse();
  for (const parameterMetadata of endpointParameters) {
    switch (parameterMetadata.Type) {
      case ParameterType.FROM_HEADER:
        const modelBinding = new FromHeaderModelBinding(
          parameterMetadata,
          request.headers
        );
        parameters[parameterMetadata.Index] = await modelBinding.Bind();
        break;
      case ParameterType.FROM_ROUTE:
        const fromRouteModelBinding = new FromRouteModelBinding(
          parameterMetadata,
          request.params
        );
        parameters[parameterMetadata.Index] =
          await fromRouteModelBinding.Bind();
        break;
      case ParameterType.FROM_QUERY:
        const fromQueryModelBinding = new FromQueryModelBinding(
          parameterMetadata,
          request.query
        );
        parameters[parameterMetadata.Index] =
          await fromQueryModelBinding.Bind();
        break;
      case ParameterType.FROM_SERVICES:
        const fromServiceModelBinding = new FromServiceModelBinding(
          parameterMetadata,
          CoreInjector.GetRequiredService(parameterMetadata.Payload)
        );
        parameters[parameterMetadata.Index] =
          await fromServiceModelBinding.Bind();
        break;
      case ParameterType.FROM_BODY:
        const fromBodyModelBinding = new FromBodyModelBinding(
          parameterMetadata,
          request.body
        );
        parameters[parameterMetadata.Index] = await fromBodyModelBinding.Bind();
        break;

      default:
        throw new InvalidOperationException(
          'An unspported HTTP decorator was used.'
        );
    }
  }
  return parameters;
};
