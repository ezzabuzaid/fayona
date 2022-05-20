import { HttpEndpointMetadata } from '@fayona/core';
import { ServiceType } from 'tiny-injector';

export abstract class Factory {
  public abstract CreateRoute(): any; // FIXME: should contain type that at least have the minmum needed apis
  public abstract OnRouteAdded(): void;
  public abstract OnActionAdded(
    httpEndpointMetadata: HttpEndpointMetadata
  ): void;

  public abstract GetRequest(...args: any[]): Request;
  public abstract GetResponse(...args: any[]): Response;
  public abstract GetDelegate(...args: any[]): (...delegateArgs: any[]) => void;
  public abstract GetBody(request: any): Record<string, any>;
  public abstract GetParams(request: any): Record<string, string>;
  public abstract GetQuery(request: any): Record<string, string>;
  public abstract GetHeaders(request: any): Record<string, string | string[]>;
  public abstract AttachInjector(
    request: any,
    injector: (serviceType: ServiceType<any>) => any
  ): void;
  public abstract GetInjector(
    request: any
  ): (serviceType: ServiceType<any>) => any;
}
