import type { Request, Response } from 'express';
import { Injectable, ServiceLifetime } from 'tiny-injector';
import { ServiceProvider } from 'tiny-injector/ServiceProvider';

import { ClaimsPrincipal } from '../Claims';
import { CORE_SERVICE_COLLECTION, CoreInjector } from '../CoreInjector';
import { InvalidOperationException } from '../Exceptions/InvalidOperationException';
import { HttpEndpointMetadata, HttpRouteMetadata } from '../Metadata';
import { IsNullOrUndefined } from '../Utils/Utils';

export class HttpContext {
  public User?: ClaimsPrincipal;
  constructor(
    public readonly RequestServices: ServiceProvider,
    public readonly Request: Request,
    public readonly Response: Response,
    public readonly EndpointMetadata: HttpEndpointMetadata,
    public readonly RouteMetadata: HttpRouteMetadata
  ) {}
}

export class HttpContextBuilder {
  public User?: ClaimsPrincipal;
  public RequestServices?: ServiceProvider;
  public Request?: Request;
  public Response?: Response;
  public EndpointMetadata?: HttpEndpointMetadata;
  public RouteMetadata?: HttpRouteMetadata;

  public SetUser(user: ClaimsPrincipal): HttpContextBuilder {
    this.User = user;
    return this;
  }
  public SetServiceProvider(
    serviceProvider: ServiceProvider
  ): HttpContextBuilder {
    this.RequestServices = serviceProvider;
    return this;
  }
  public SetRequest(request: Request): HttpContextBuilder {
    this.Request = request;
    return this;
  }

  public SetResponse(response: Response): HttpContextBuilder {
    this.Response = response;
    return this;
  }

  public SetEndpointMetadata(
    httpEndpointMetadata: HttpEndpointMetadata
  ): HttpContextBuilder {
    this.EndpointMetadata = httpEndpointMetadata;
    return this;
  }
  public SetRouteMetadata(
    routeMetadata: HttpRouteMetadata
  ): HttpContextBuilder {
    this.RouteMetadata = routeMetadata;
    return this;
  }

  public Build(): HttpContext {
    this.Validate();
    const context = new HttpContext(
      this.RequestServices!,
      this.Request!,
      this.Response!,
      this.EndpointMetadata!,
      this.RouteMetadata!
    );
    context.User = this.User;
    this.Reset();
    return context;
  }

  private Validate(): void {
    if (
      [
        this.RequestServices,
        this.Request,
        this.Response,
        this.EndpointMetadata,
        this.RouteMetadata,
      ].some(IsNullOrUndefined)
    ) {
      throw new InvalidOperationException(
        `Construction of HttpContext is not possiple.`
      );
    }
  }
  private Reset(): void {
    this.User = undefined;
    this.Request = undefined;
    this.Response = undefined;
    this.RequestServices = undefined;
    this.EndpointMetadata = undefined;
  }
}
