import {
  ClaimsPrincipal,
  HttpEndpointMetadata,
  Metadata,
  SaveReturn,
} from '@fayona/core';
import type { Request, Response } from 'express';
import { Context, Injectable, Injector, ServiceLifetime } from 'tiny-injector';

@Injectable({
  lifetime: ServiceLifetime.Scoped,
})
export class HttpContext {
  public User?: ClaimsPrincipal;
  public readonly Request: Request = this.context.getExtra('request');
  public readonly Response: Response = this.context.getExtra('response');
  constructor(private context: Context) {}

  public GetMetadata(): HttpEndpointMetadata | null {
    const endpointPath = this.Request.route?.path;
    const metadata = Injector.GetRequiredService(Metadata);
    const route = SaveReturn(() => {
      return metadata.GetHttpRoute((item) => {
        return !!item?.EndpointMap.get(endpointPath);
      });
    });
    return route?.EndpointMap.get(endpointPath) ?? null;
  }
}
