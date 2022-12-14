import type { Request, Response } from 'express';
import { Context, Injectable, Injector, ServiceLifetime } from 'tiny-injector';

import { HttpEndpointMetadata, Metadata } from '../Metadata';
import { SafeReturn } from '../Utils/Utils';
import { IHttpContext } from './IHttpContext';

@Injectable({
  lifetime: ServiceLifetime.Scoped,
})
export class HttpContext implements IHttpContext {
  public readonly Request: Request;
  public readonly Response: Response;
  constructor(private context: Context) {
    this.Request = this.context.getExtra('request');
    this.Response = this.context.getExtra('response');
  }

  public GetMetadata(): HttpEndpointMetadata | null {
    const endpointPath = this.Request.route?.path;
    const metadata = Injector.GetRequiredService(Metadata);
    const route = SafeReturn(() => {
      return metadata.GetHttpRoute((item) => {
        return !!item?.EndpointMap.get(endpointPath);
      });
    });
    return route?.EndpointMap.get(endpointPath) ?? null;
  }
}
