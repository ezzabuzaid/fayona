import * as express from 'express';
import {
  Inject,
  Injectable,
  ServiceLifetime,
  ServiceType,
} from 'tiny-injector';

import { HttpEndpointMetadata, IsConstructor } from '@fayona/core';
import {
  Factory,
  FromBodyParameterMetadata,
  FromHeaderParameterMetadata,
  FromQueryParamerterMetadata,
  FromRouteParameterMetadata,
} from '@fayona/routing';

import { EXPRESS_TOKEN } from './ExpressToken';
import { ValidateModel } from './ValidateModel';
import { mapper } from './mappings';

// fayona.GetRoutes().forEach((route) => {
//   application.use(route.GetRouter());
// });

@Injectable({
  serviceType: Factory,
  lifetime: ServiceLifetime.Singleton,
})
export class RouteFactory extends Factory {
  public async GetBody(
    metadata: FromBodyParameterMetadata,
    request: any
  ): Promise<Record<string, any>> {
    const body = mapper.map(request.body, metadata.ParamType);
    await ValidateModel(body);
    return body;
  }

  public GetParams(
    metadata: FromRouteParameterMetadata,
    request: any
  ): Record<string, string> {
    return request.params;
  }

  public GetQuery(
    metadata: FromQueryParamerterMetadata,
    request: any
  ): Record<string, string> {
    if (IsConstructor<any>(metadata.ParamType)) {
      const query = mapper.map(request.query, metadata.ParamType);
      ValidateModel(query);
      return query;
    }
    return request.query;
  }

  public GetHeaders(
    metadata: FromHeaderParameterMetadata,
    request: any
  ): Record<string, string | string[]> {
    return request.headers;
  }

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
