import { IWebApplicationBuilder, WebApplicationBuilder } from '@fayona/core';
import { Injector, ServiceType } from 'tiny-injector';

import { IAuthenticationOptions } from './AuthenticationOptions';
import { AuthenticationScheme } from './AuthenticationScheme';
import { AuthenticationService } from './AuthenticationService';
import { IAuthenticationHandler } from './IAuthenticationHandler';
import { IAuthenticationService } from './IAuthenticationService';

const prototype: import('@fayona/core').IWebApplicationBuilder =
  WebApplicationBuilder.prototype as any;

prototype.AddAuthentication = function (
  optFn: (options: IAuthenticationOptions) => void
): IWebApplicationBuilder {
  const options = new IAuthenticationOptions();
  optFn(options);
  this.Services.AddSingleton(IAuthenticationOptions, () => options);
  this.Services.AddSingleton(IAuthenticationService, AuthenticationService);
  return this;
};

prototype.AddSchema = function (
  handlerType: ServiceType<IAuthenticationHandler>,
  authenticationScheme: string,
  displayName?: string
): IWebApplicationBuilder {
  const authenticationOptions = Injector.Of(this.Services).GetRequiredService(
    IAuthenticationOptions
  );
  authenticationOptions.AddScheme(
    new AuthenticationScheme(handlerType, authenticationScheme, displayName)
  );
  this.Services.AddTransient(handlerType);
  return this;
};
