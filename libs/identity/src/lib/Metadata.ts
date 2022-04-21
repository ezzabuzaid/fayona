import { MakeHandlerName } from '@fayona/utils';
import type { RequestHandler } from 'express';
import { Logger } from 'tslog';

import { AuthorizationPolicy } from './AuthorizationPolicy';
import { AuthorizationPolicyBuilder } from './AuthorizationPolicyBuilder';

const logger = new Logger({ name: 'Routing', minLevel: 'error' });

export class Metadata {
  #EndpointToPolicy: Record<string, AuthorizationPolicy[]> = {};
  #EndpointToAuthorize: Record<string, RequestHandler[]> = {};

  public RegisterPolicy(endpointId: string, policy: AuthorizationPolicy): void {
    if (!Array.isArray(this.#EndpointToPolicy[endpointId])) {
      this.#EndpointToPolicy[endpointId] = [];
    }
    this.#EndpointToPolicy[endpointId].push(policy);
  }

  public GetPolices(endpointId: string): AuthorizationPolicy[] {
    return this.#EndpointToPolicy[endpointId];
  }

  public RegisterAuthorize(
    endpointId: string,
    middleware: RequestHandler
  ): void {
    logger.debug('Registering Authorize', endpointId);

    if (!Array.isArray(this.#EndpointToAuthorize[endpointId])) {
      this.#EndpointToAuthorize[endpointId] = [];
    }
    this.#EndpointToAuthorize[endpointId].push(middleware);
  }

  public GetAuthorizeMiddlewares(endpointId: string): RequestHandler[] {
    return this.#EndpointToAuthorize[endpointId] ?? [];
  }
}
