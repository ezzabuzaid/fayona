import { WebApplicationBuilder } from '@fayona/core';

import { AuthenticationOptions } from './AuthenticationOptions';

declare module '@fayona/core' {
  export interface IWebApplicationBuilder {
    AddAuthentication(optFn: (options: AuthenticationOptions) => void): void;
  }
}
const prototype: import('@fayona/core').IWebApplicationBuilder =
  WebApplicationBuilder.prototype as any;

prototype.AddAuthentication = function (
  optFn: (options: AuthenticationOptions) => void
): void {
  const options = new AuthenticationOptions();
  optFn(options);
  this.Services.AddSingleton(AuthenticationOptions, () => options);
};
