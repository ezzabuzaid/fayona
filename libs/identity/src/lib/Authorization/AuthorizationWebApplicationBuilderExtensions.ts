import { WebApplicationBuilder } from '@fayona/core';
import { AbstractClassType, ClassType } from 'tiny-injector/Types';

import { IAuthenticationOptions } from '../Authentication/AuthenticationOptions';
import { AuthorizationEvaluator } from '../AuthorizationEvaluator';
import { AuthorizationOptions } from '../AuthorizationOptions';
import { AuthorizationService } from '../AuthorizationService';
import { IAuthorizationHandler } from '../IAuthorizationHandler';
import { PassThroughAuthorizationHandler } from '../PassThroughAuthorizationHandler';

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
