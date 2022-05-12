import { ServiceType } from 'tiny-injector';

import { IAuthenticationOptions } from './lib';
import { IAuthenticationHandler } from './lib/Authentication/IAuthenticationHandler';
import { AuthorizationOptions } from './lib/AuthorizationOptions';

declare module '@fayona/core' {
  export interface IWebApplicationBuilder {
    AddAuthorization(optFn: (options: AuthorizationOptions) => void): void;

    AddAuthentication(
      optFn: (options: IAuthenticationOptions) => void
    ): IWebApplicationBuilder;

    AddSchema(
      handlerType: ServiceType<IAuthenticationHandler>,
      authenticationScheme: string,
      displayName?: string
    ): IWebApplicationBuilder;
  }

  export interface IWebApplication {
    UseAuthorization(): IWebApplication;
    UseAuthentication(): IWebApplication;
  }
}
