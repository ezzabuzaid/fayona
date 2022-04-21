import { WebApplicationBuilder } from '@fayona/core';
import { AbstractClassType, ClassType } from 'tiny-injector/Types';

import { AuthenticationOptions } from '../Authentication/AuthenticationOptions';
import { AuthorizationEvaluator } from '../AuthorizationEvaluator';
import { AuthorizationOptions } from '../AuthorizationOptions';
import { AuthorizationService } from '../AuthorizationService';
import { IAuthorizationHandler } from '../IAuthorizationHandler';
import { PassThroughAuthorizationHandler } from '../PassThroughAuthorizationHandler';

interface IAuthorizationServiceCollectionExtensions {
  AddAuthorization(optFn: (options: AuthorizationOptions) => void): void;
  AddAuthentication(optFn: (options: AuthenticationOptions) => void): void;
}

declare module '@fayona/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface IWebApplicationBuilder
    extends IAuthorizationServiceCollectionExtensions {}
}
const prototype: import('@fayona/core').IWebApplicationBuilder =
  WebApplicationBuilder.prototype as any;

prototype.AddAuthorization = function (
  optFn: (options: AuthorizationOptions) => void
): void {
  const options = new AuthorizationOptions();
  optFn(options);
  // Add auth related services here and not using "Injectable"
  // https://github.com/dotnet/aspnetcore/blob/main/src/Security/Authorization/Core/src/AuthorizationServiceCollectionExtensions.cs
  this.Services.TryAddTransient(AuthorizationService);
  this.Services.TryAddTransient(AuthorizationEvaluator);
  this.Services.AppendTransient(
    IAuthorizationHandler,
    PassThroughAuthorizationHandler
  );
  this.Services.AddSingleton(AuthorizationOptions, () => options);
};
prototype.AddAuthentication = function (
  optFn: (options: AuthenticationOptions) => void
): void {
  const options = new AuthenticationOptions();
  optFn(options);
  this.Services.AddSingleton(AuthenticationOptions, () => options);
};
