import { Action, NotNullOrUndefined } from '@fayona/core';
import { HttpContext, IHttpContext } from '@fayona/core';
import { Factory } from '@fayona/routing';
import { RequestHandler } from 'express';
import { Injector } from 'tiny-injector';

import { IAuthenticationOptions } from './AuthenticationOptions';
import { AuthenticationSchemeProvider } from './AuthenticationSchemeProvider';
import { AuthenticationService } from './AuthenticationService';

export function AuthenticationMiddleware(
  configure: Action<IAuthenticationOptions, void>
): RequestHandler {
  Injector.AddSingleton(IAuthenticationOptions, () => {
    const authenticationOptions = new IAuthenticationOptions();
    configure(authenticationOptions);
    return authenticationOptions;
  });

  return async (...args: any[]) => {
    const factory = Injector.GetRequiredService(Factory);
    const request = factory.GetRequest(...args);
    const inject = factory.GetInjector(request);
    const delegate = factory.GetDelegate(...args);
    const authenticationService = inject(AuthenticationService);
    const authenticationSchemeProvider = inject(AuthenticationSchemeProvider);
    const defaultAuthenticate =
      authenticationSchemeProvider.GetDefaultAuthenticateScheme();
    const httpContext: IHttpContext = inject(HttpContext);

    if (NotNullOrUndefined(defaultAuthenticate)) {
      try {
        const result = await authenticationService.Authenticate(
          httpContext,
          defaultAuthenticate.Name
        );
        httpContext.User = result;
      } catch (error) {
        delegate(error);
      }
    }
    delegate();
  };
}
