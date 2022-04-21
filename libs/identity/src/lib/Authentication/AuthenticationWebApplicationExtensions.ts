import { IWebApplication, WebApplicationBuilder } from '@fayona/core';
import * as passport from 'passport';
import { AbstractClassType, ClassType } from 'tiny-injector/Types';

import { ClaimTypes } from '../Claims/ClaimType';
import { ClaimsIdentity } from '../Claims/ClaimsIdentity';
import { ClaimsPrincipal } from '../Claims/ClaimsPrincipal';
import { IdentityInjector } from '../IdentityServiceCollection';
import {
  AuthenticationOptions,
  AuthenticationStrategy,
} from './AuthenticationOptions';

declare module '@fayona/core' {
  export interface IWebApplication {
    UseAuthentication(): void;
  }
}

const prototype: import('@fayona/core').IWebApplication =
  WebApplicationBuilder.prototype as any;

prototype.UseAuthentication = function (): void {
  // https://github.com/dotnet/aspnetcore/blob/main/src/Security/Authentication/Core/src/AuthenticationMiddleware.cs
  // TODO: add IAuthenticationHandlerProvider, it acts as pipeline breaker, it has one method that returns boolean.
  const authenticationOptions = IdentityInjector.GetRequiredService(
    AuthenticationOptions
  );
  const strategy = authenticationOptions.Strategies.find(
    (it: AuthenticationStrategy): boolean =>
      it.Name === authenticationOptions.DefaultStrategyName
  );
  if (!strategy) {
    throw new Error(
      `${authenticationOptions.DefaultStrategyName} is not configured.`
    );
  }
  const user: ClaimsPrincipal = new ClaimsPrincipal();
  const identity: ClaimsIdentity = new ClaimsIdentity(
    'Application.Identity',
    ClaimTypes.Name,
    ClaimTypes.Role
  );
  user.AddIdentity(identity);
  passport.use(authenticationOptions.DefaultStrategyName, strategy.Strategy);
};
