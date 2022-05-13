import {
  ArgumentNullException,
  CORE_SERVICE_COLLECTION,
  CoreInjector,
  HttpContext,
  HttpContextBuilder,
  IWebApplication,
  IWebApplicationBuilder,
  IsNullOrUndefined,
  Metadata,
  Middleware,
  WEB_APPLICATION_OPTIONS,
  WebApplicationBuilder,
} from '@fayona/core';
import { Request, Response } from 'express';
import * as glob from 'fast-glob';
import { Context } from 'tiny-injector';
import { ServiceProvider } from 'tiny-injector/ServiceProvider';

import { RequestIdOptions } from './Middleware/RequestId';
import { RouteOptions } from './RouteOptions';

declare module '@fayona/core' {
  export interface IWebApplicationBuilder {
    AddRequestId(
      optFn: (options: RequestIdOptions) => void
    ): IWebApplicationBuilder;
    AddHsts(): IWebApplicationBuilder;
    AddRouting(optFn?: (options: RouteOptions) => void): IWebApplicationBuilder;
  }
  export interface WebApplicationOptions {
    Controllers: string[];
    RoutingAdaptar: ReturnType<typeof import('express')>;
  }
}
const prototype: import('@fayona/core').IWebApplicationBuilder =
  WebApplicationBuilder.prototype as any;
const originalBuild = prototype.Build;

prototype.Build = function (): IWebApplication {
  const metadata = CoreInjector.GetRequiredService(Metadata);
  const options = CoreInjector.GetRequiredService(WEB_APPLICATION_OPTIONS);
  const app = originalBuild();

  app.RoutingAdaptar = options.RoutingAdaptar;

  if (IsNullOrUndefined(options.RoutingAdaptar)) {
    throw new ArgumentNullException('RoutingAdaptar');
  }

  // Load the controllers so the decorators can be activated.
  glob.sync(options.Controllers, { absolute: true }).forEach((filePath) => {
    require(filePath);
  });

  // TODO: Not found handler should come here - UseExceptionHandler
  // TODO: Fav icon handler should come here - UseStaticFile should be here instead - if an endpoint/file not found throw an error

  AddHttpContext();

  options.RoutingAdaptar.use(async (req, res, next) => {
    const context = CoreInjector.Create();
    const dispose = (): void => CoreInjector.Destroy(context);
    context.setExtra('request', req);
    context.setExtra('response', res);

    req.Locate = (serviceType: any): any =>
      CoreInjector.GetRequiredService(serviceType, context);

    await InvokeMiddlewares(
      CoreInjector.GetRequiredService(HttpContext, context),
      context
    );

    ['error', 'end'].forEach((eventName) => {
      req.on(eventName, dispose);
    });

    next();
  });
  metadata.GetHttpRoutes().forEach((route) => {
    // route.GetPath(),
    // // process.env.SKIP_REGISTERING_ROUTE ? '' : prefixedEndpoint, // For Cloud Function to work
    options.RoutingAdaptar.use(route.GetRouter());
  });
  return app;
};

prototype.AddRequestId = function (
  optFn: (options: RequestIdOptions) => void
): IWebApplicationBuilder {
  const options = new RequestIdOptions();
  optFn(options);
  this.Services.TryAddTransient(RequestIdOptions, () => options);
  return this;
};
prototype.AddHsts = function (): IWebApplicationBuilder {
  throw new Error('Not Implemented.');
};
prototype.AddRouting = function (): IWebApplicationBuilder {
  throw new Error('Not Implemented.');
};

function GetMiddlewares(context: Context): Middleware[] {
  try {
    return CoreInjector.GetServices(Middleware, context);
  } catch (error) {
    return [];
  }
}

async function InvokeMiddlewares(
  httpContext: HttpContext,
  context: Context
): Promise<void> {
  let index = 0;
  const middlewares = GetMiddlewares(context);
  const RequestDelegate = async (): Promise<() => Promise<void>> => {
    index++;
    return async (): Promise<void> => {
      const mw = middlewares.at(index);
      if (mw) {
        await middlewares[index].Invoke(httpContext, await RequestDelegate());
      }
      return Promise.resolve();
    };
  };

  // Invoke first middleware
  const firstMiddleware = middlewares.at(index);
  if (firstMiddleware) {
    await firstMiddleware.Invoke(httpContext, await RequestDelegate());
  }
}

function PatchContextToServiceProvider(context: Context): ServiceProvider {
  const serviceProvider = CORE_SERVICE_COLLECTION.BuildServiceProvider();
  return Object.assign({
    GetRequiredService: (arg1: any) => {
      return serviceProvider.GetRequiredService(arg1, context);
    },
    GetService: (arg1: any) => {
      return serviceProvider.GetService(arg1, context);
    },
    GetServices: (arg1: any) => {
      return serviceProvider.GetServices(arg1, context);
    },
  });
}

function AddHttpContext(): void {
  CoreInjector.AddScoped(HttpContext, (context) => {
    const request: Request = context.getExtra('request');
    const response: Response = context.getExtra('response');
    // const metadata = CoreInjector.GetRequiredService(Metadata);
    // const route = SaveReturn(() => {
    //   return metadata.GetHttpRoute(
    //     (item) => item.EndpointMap.get(request.url)
    //     // FIXME: /example/:id - such route cannot be find because id will be replaced with fixed value
    //     // You've to replicate express function that replace those params
    //   );
    // });
    const httpContext = new HttpContextBuilder()
      .SetServiceProvider(PatchContextToServiceProvider(context))
      .SetRequest(request)
      .SetResponse(response)
      // .SetEndpointMetadata(route?.EndpointMap.get(request.url))
      // .SetRouteMetadata(route)
      .Build();
    return httpContext;
  });
}
