import { Action, NotNullOrUndefined } from '@fayona/core';
import { HttpContext, IHttpContext } from '@fayona/core';
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

  return async (req, res, next) => {
    const authenticationService = req.Inject(AuthenticationService);
    const authenticationSchemeProvider = req.Inject(
      AuthenticationSchemeProvider
    );
    const defaultAuthenticate =
      authenticationSchemeProvider.GetDefaultAuthenticateScheme();
    const httpContext: IHttpContext = req.Inject(HttpContext);

    if (NotNullOrUndefined(defaultAuthenticate)) {
      try {
        const result = await authenticationService.Authenticate(
          httpContext,
          defaultAuthenticate.Name
        );
        httpContext.User = result;
      } catch (error) {
        next(error);
      }
    }
    next();
  };
}
