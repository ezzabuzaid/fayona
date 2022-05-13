import { WebApplication } from '@fayona/core';

import { HstsMiddlware } from './Middleware/HstsMiddleware';
import { RequestIdMiddleware } from './Middleware/RequestId';

declare module '@fayona/core' {
  export interface IWebApplication {
    RoutingAdaptar: ReturnType<typeof import('express')>;

    /**
     * Add unique id to each request to make them distinguishable.
     *
     * @param headerName to add with request id. 'X-Request-Id' as common name.
     */

    UseRequestId(): void;

    UseHsts(): void;

    UseExceptionHandler(): void;
  }
}

const prototype: import('@fayona/core').IWebApplication =
  WebApplication.prototype as any;

prototype.UseRequestId = function (): void {
  this.UseMiddleware(RequestIdMiddleware);
};

prototype.UseHsts = function (): void {
  this.UseMiddleware(HstsMiddlware);
};
