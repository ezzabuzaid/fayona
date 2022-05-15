import {
  HttpEndpointMetadata,
  HttpRouteMetadata,
  Metadata,
} from '@fayona/core';
import { RequestHandler } from 'express';
import * as glob from 'fast-glob';
import 'reflect-metadata';
import { Context, Injector } from 'tiny-injector';

export * from './lib/Decorators/FromBody';
export * from './lib/Decorators/FromHeaders';
export * from './lib/Decorators/FromQuery';
export * from './lib/Decorators/FromRoute';
export * from './lib/Decorators/FromServices';
export * from './lib/Decorators/HttpDelete';
export * from './lib/Decorators/HttpGet';
export * from './lib/Decorators/HttpPatch';
export * from './lib/Decorators/HttpPost';
export * from './lib/Decorators/HttpPut';
export * from './lib/Decorators/Route';
export * from './lib/Http/HttpContext';

// FIXME: replace it with correct return type
export * from './lib/Response';

export interface IFayona {
  Init(options: { controllers: string[] }): RequestHandler;
  GetEndpoints(): HttpEndpointMetadata[];
  GetRoutes(): HttpRouteMetadata[];
}

// FIXME: provide factory abstraction to avoid any dependencies

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class Fayona implements IFayona {
  [method: string]: any;
  private Metadata = Injector.GetRequiredService(Metadata);

  constructor() {
    Injector.AddScoped(Context, (context) => context);
  }

  // public Authentication(
  //   configure: Action<any, void>
  // ): RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>> {
  //   throw new Error('Method not implemented.');
  // }

  public Init(options: { controllers: string[] }): RequestHandler {
    // Load the controllers so the decorators can be activated.
    glob.sync(options.controllers, { absolute: true }).forEach((filePath) => {
      require(filePath);
    });

    return (req, res, next) => {
      const context = Injector.Create();
      const dispose = (): void => Injector.Destroy(context);
      context.setExtra('request', req);
      context.setExtra('response', res);

      req.Inject = (serviceType: any): any =>
        Injector.GetRequiredService(serviceType, context);

      ['error', 'end'].forEach((eventName) => {
        req.on(eventName, dispose);
      });

      next();
    };
  }

  public GetRoutes(): HttpRouteMetadata[] {
    return this.Metadata.GetHttpRoutes();
  }

  public GetEndpoints(): HttpEndpointMetadata[] {
    return this.Metadata.GetHttpRoutes()
      .map((route) => route.endpoints)
      .flat();
  }
}
