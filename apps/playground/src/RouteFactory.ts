import { HttpEndpointMetadata } from '@fayona/core';
import { Factory } from '@fayona/routing';
import * as express from 'express';
import {
  Inject,
  Injectable,
  ServiceLifetime,
  ServiceType,
} from 'tiny-injector';

import { EXPRESS_TOKEN } from './ExpressToken';

// fayona.GetRoutes().forEach((route) => {
//   application.use(route.GetRouter());
// });
@Injectable({
  serviceType: Factory,
  lifetime: ServiceLifetime.Singleton,
})
export class RouteFactory extends Factory {
  constructor(
    @Inject(EXPRESS_TOKEN) private _application: ReturnType<typeof express>
  ) {
    super();
  }
  public GetInjector(request: any): (serviceType: ServiceType<any>) => any {
    return request.___Inject;
  }

  public AttachInjector<T>(
    request: any,
    injector: (serviceType: ServiceType<T>) => T
  ): void {
    request.___Inject = (serviceType) => injector(serviceType);
  }

  public GetBody(request: express.Request): Record<string, any> {
    return request.body;
  }
  public GetParams(request: express.Request): Record<string, string> {
    return request.params;
  }
  public GetQuery(request: express.Request): Record<string, any> {
    return request.query;
  }
  public GetHeaders(
    request: express.Request
  ): Record<string, string | string[]> {
    return request.headers;
  }

  public OnRouteAdded(): void {
    throw new Error('Method not implemented.');
  }

  public OnActionAdded(endpoint: HttpEndpointMetadata): void {
    this._application[endpoint.method](
      endpoint.FullPath,
      async (req, res, next) => {
        try {
          const endpointResponse = await endpoint.FinalHandler(req, res, next);
          res
            .status(endpointResponse.StatusCode)
            .json(endpointResponse.ToJson());
          next();
        } catch (error) {
          next(error);
        }
      }
    );
  }

  public CreateRoute() {
    throw new Error('Method not implemented.');
  }

  public GetRequest(req, res, next): Request {
    return req;
  }

  public GetResponse(req, res, next): Response {
    return res;
  }
  public GetDelegate(req, res, next): () => void {
    return (...args) => next(...args);
  }
}
