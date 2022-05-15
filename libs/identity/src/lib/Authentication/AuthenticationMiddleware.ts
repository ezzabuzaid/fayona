import {
  Action,
  ClaimTypes,
  ClaimsIdentity,
  ClaimsPrincipal,
  IsNullOrUndefined,
  NotNullOrUndefined,
} from '@fayona/core';
import { HttpContext } from '@fayona/routing';
import { NextFunction, RequestHandler } from 'express';
import { ProblemDetailsException } from 'rfc-7807-problem-details';
import { Injectable, Injector, ServiceLifetime } from 'tiny-injector';

import { IAuthenticationOptions } from './AuthenticationOptions';
import { AuthenticationSchemeProvider } from './AuthenticationSchemeProvider';
import { AuthenticationService } from './AuthenticationService';
import { IAuthenticationService } from './IAuthenticationService';

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
    const httpContext = req.Inject(HttpContext);

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
