import {
  IWebApplication,
  WebApplication,
  WebApplicationBuilder,
} from '@fayona/core';

import { AuthorizationMiddleware } from './AuthorizationMiddleware';

const prototype: import('@fayona/core').IWebApplication =
  WebApplication.prototype as any;

prototype.UseAuthorization = function (): IWebApplication {
  // TODO Add auth middleware here
  this.UseMiddleware(AuthorizationMiddleware);
  return this;
};
