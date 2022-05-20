import { Injectable, ServiceLifetime } from 'tiny-injector';

import { InvalidOperationException } from '../Exceptions/InvalidOperationException';
import { IsNullOrUndefined } from '../Utils/Utils';
import { HttpEndpointMetadata } from './HttpEndpointMetadata';
import { HttpRouteMetadata } from './HttpRouteMetadata';
import { ParameterMetadata } from './ParameterMetadata';

@Injectable({
  lifetime: ServiceLifetime.Singleton,
})
export class Metadata {
  #Routes: HttpRouteMetadata[] = [];

  public RegisterParameter(parameterMetadata: ParameterMetadata<any>): void {
    let routeMetadata = this.#Routes.find(
      (item) => item.controller === parameterMetadata.controller
    );
    if (IsNullOrUndefined(routeMetadata)) {
      // Parameter decorators execute before any other decorators thereby we need to
      // add partial route config and to be updated when the @Route decorator executes
      routeMetadata = new HttpRouteMetadata(parameterMetadata.controller);
      this.#Routes.push(routeMetadata);
    }
    let endpointMetadata = routeMetadata.endpoints.find(
      (item) =>
        item.controller === parameterMetadata.controller &&
        item.handler === parameterMetadata.handler
    )!;

    if (IsNullOrUndefined(endpointMetadata)) {
      endpointMetadata = new HttpEndpointMetadata(
        parameterMetadata.controller,
        parameterMetadata.handler
      );
      routeMetadata.endpoints.push(endpointMetadata);
    }

    endpointMetadata.Parameters.push(parameterMetadata);
  }

  public RegisterHttpEndpoint(endpointMetadata: HttpEndpointMetadata): void {
    let routeMetadata = this.#Routes.find(
      (item) => item.controller === endpointMetadata.controller
    );
    if (IsNullOrUndefined(routeMetadata)) {
      // Method decorators execute before class decorators thereby we need to
      // add partial route config and to be updated when the @Route decorator executes
      routeMetadata = new HttpRouteMetadata(endpointMetadata.controller);
      routeMetadata.endpoints.push(endpointMetadata);
      this.#Routes.push(routeMetadata);
    } else {
      // If this hits here, then the initial endpoint metadata have been set by its parameter metadata
      const existingEndpointMetadata = routeMetadata.endpoints.find(
        (item) =>
          item.controller === endpointMetadata.controller &&
          item.handler === endpointMetadata.handler
      )!;
      // if existingEndpointMetadata is found then we need to complete setting the other fields
      // if not then we need to push the new EndpointMetadata
      if (existingEndpointMetadata) {
        existingEndpointMetadata.handler = endpointMetadata.handler;
        existingEndpointMetadata.method = endpointMetadata.method;
        existingEndpointMetadata.middlewares = endpointMetadata.middlewares;
        existingEndpointMetadata.path = endpointMetadata.path;
      } else {
        routeMetadata.endpoints.push(endpointMetadata);
      }
    }
  }

  // public RegisterHttpRoute(httpRouteMetadata: HttpRouteMetadata): void {
  //   try {
  //     const metadata = this.GetHttpRoute(
  //       (item) => item.controller === httpRouteMetadata.controller
  //     );
  //     metadata.SetRouter(httpRouteMetadata.router!, httpRouteMetadata.path!);
  //   } catch (error) {
  //     if (error instanceof InvalidOperationException) {
  //       throw new InvalidOperationException(
  //         `Looks like "${httpRouteMetadata.controller.name}" controlller doesn't contain any endpoints`
  //       );
  //     }
  //   }
  // }

  public GetHttpRoutes(): HttpRouteMetadata[] {
    return Array.from(this.#Routes);
  }

  public GetHttpRoute(
    predicate: (item: HttpRouteMetadata) => boolean
  ): HttpRouteMetadata {
    const metadata = this.#Routes.find(predicate);
    if (IsNullOrUndefined(metadata)) {
      throw new InvalidOperationException(`There is not metadata.`);
    }
    return metadata;
  }
}
