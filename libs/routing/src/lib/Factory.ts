import { ServiceType } from 'tiny-injector';

import { HttpEndpointMetadata } from '@fayona/core';

import { FromBodyParameterMetadata } from './Metadata/FromBodyParameterMetadata';
import { FromHeaderParameterMetadata } from './Metadata/FromHeaderParameterMetadata';
import { FromQueryParamerterMetadata } from './Metadata/FromQueryParamerterMetadata';
import { FromRouteParameterMetadata } from './Metadata/FromRouteParameterMetadata';

export abstract class Factory {
  // public abstract CreateRoute(): any; // FIXME: should contain type that at least have the minmum needed apis
  // public abstract OnRouteAdded(): void;
  public abstract OnActionAdded(
    httpEndpointMetadata: HttpEndpointMetadata
  ): void;

  public abstract GetRequest(...args: any[]): Request;
  public abstract GetResponse(...args: any[]): Response;
  public abstract GetDelegate(...args: any[]): (...delegateArgs: any[]) => void;

  public abstract GetBody(
    metadata: FromBodyParameterMetadata,
    request: any
  ): Promise<Record<string, any>> | Record<string, any>;
  public abstract GetParams(
    metadata: FromRouteParameterMetadata,
    request: any
  ): Promise<Record<string, string>> | Record<string, string>;
  public abstract GetQuery(
    metadata: FromQueryParamerterMetadata,
    request: any
  ): Promise<Record<string, string>> | Record<string, string>;
  public abstract GetHeaders(
    metadata: FromHeaderParameterMetadata,
    request: any
  ):
    | Promise<Record<string, string | string[]>>
    | Record<string, string | string[]>;

  public abstract AttachInjector(
    request: any,
    injector: (serviceType: ServiceType<any>) => any
  ): void;
  public abstract GetInjector(
    request: any
  ): (serviceType: ServiceType<any>) => any;
}
