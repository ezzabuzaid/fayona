import {
  HttpEndpointMetadata,
  HttpRouteMetadata,
  Metadata,
} from '@fayona/core';
import { RequestHandler } from 'express';
import * as glob from 'fast-glob';
import { Context, Injector } from 'tiny-injector';

export interface IFayona {
  Init(options: { controllers: string[] }): RequestHandler;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class Fayona implements IFayona {
  private Metadata = Injector.GetRequiredService(Metadata);

  constructor() {
    Injector.AddScoped(Context, (context) => context);
  }
  public Init(options: { controllers: string[] }): RequestHandler {
    // Load the controllers so the decorators can be activated.
    glob.sync(options.controllers, { absolute: true }).forEach((filePath) => {
      require(filePath);
    });

    // TODO: Fav icon handler should come here - UseStaticFile should be here instead - if an endpoint/file not found throw an error

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
