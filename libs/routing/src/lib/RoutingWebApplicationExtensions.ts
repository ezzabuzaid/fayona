import { WebApplication, WebApplicationBuilder } from '@fayona/core';

import { EndpointMiddleware } from './Middleware/EndpointMiddleware';
import { HstsMiddlware } from './Middleware/HstsMiddleware';
import { RequestIdMiddleware } from './Middleware/RequestId';
import { RoutingMiddleware } from './Middleware/RoutingMiddleware';

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
    UseEndpoint(): void;
    // UseRouting(): void;
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

// prototype.UseRouting = function (): void {
//   this.UseMiddleware(RoutingMiddleware);
// };

prototype.UseEndpoint = function (): void {
  this.UseMiddleware(EndpointMiddleware);
  // this.UseMiddleware(EndpointMiddleware);
};

// public UseErrorHandler(action: (error: any) => HttpResponse): void {
//   this.#Application.use(
//     (error: Error, req: Request, res: Response, next: NextFunction) => {
//       if (res.headersSent) {
//         return next(error);
//       }
//       const response = action(error);
//       res.status(response.statusCode).json(response.toJson());
//     }
//   );
// }

// /**
//  * FIXME: refactor to .net use exception handler
//  */
// public UseNotFoundHandler(): void {
//   this.#Application.use(
//     autoHandler((req: Request) => {
//       throw new ErrorResponse(
//         `${req.originalUrl} => ${'endpoint_not_found'}`,
//         StatusCodes.NOT_FOUND,
//         'not-found'
//       );
//     })
//   );
// }
