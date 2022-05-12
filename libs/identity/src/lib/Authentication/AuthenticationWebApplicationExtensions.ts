import { IWebApplication, WebApplicationBuilder } from '@fayona/core';

import { AuthenticateMiddleware } from './AuthenticateMiddleware';

const prototype: import('@fayona/core').IWebApplication =
  WebApplicationBuilder.prototype as any;

prototype.UseAuthentication = function (): IWebApplication {
  this.UseMiddleware(AuthenticateMiddleware);
  return this;
};
