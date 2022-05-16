import { RequestHandler } from 'express';
import * as glob from 'fast-glob';
import { Context, Injector } from 'tiny-injector';

import { HttpEndpointMetadata, HttpRouteMetadata, Metadata } from '../Metadata';
import { IFayona } from './IFayona';

// FIXME: provide factory abstraction to avoid any dependencies
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class Fayona implements IFayona {
  // [method: string]: any;
  private Metadata = Injector.GetRequiredService(Metadata);

  constructor() {
    Injector.AddScoped(Context, (context) => context);
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
