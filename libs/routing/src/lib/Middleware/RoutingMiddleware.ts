import {
  Metadata,
  WEB_APPLICATION_OPTIONS,
  WebApplicationOptions,
} from '@fayona/core';
import { HttpContext } from '@fayona/core';
import { Middleware } from '@fayona/core';
import { Inject } from 'tiny-injector';

export class RoutingMiddleware extends Middleware {
  private readonly Metadata: Metadata;
  constructor(
    metadata: Metadata,
    @Inject(WEB_APPLICATION_OPTIONS) private options: WebApplicationOptions
  ) {
    super();
    this.Metadata = metadata;
  }
  public async Invoke(context: HttpContext): Promise<void> {}
}
