import {
  ClaimTypes,
  ClaimsIdentity,
  ClaimsPrincipal,
  HttpContext,
  IsNullOrUndefined,
  Middleware,
} from '@fayona/core';
import { NextFunction } from 'express';

import { IdentityInjector } from '../IdentityInjector';
import { IAuthenticationOptions } from './AuthenticationOptions';
import { IAuthenticationService } from './IAuthenticationService';

export class AuthenticateMiddleware extends Middleware {
  constructor(
    private readonly AuthenticationService: IAuthenticationService,
    private readonly AuthenticationOptions: IAuthenticationOptions
  ) {
    super();
  }
  public override async Invoke(
    context: HttpContext,
    next: NextFunction
  ): Promise<void> {
    // https://github.com/dotnet/aspnetcore/blob/main/src/Security/Authentication/Core/src/AuthenticationMiddleware.cs
    // TODO: add IAuthenticationHandlerProvider, it acts as pipeline breaker, it has one method that returns boolean.

    // const user: ClaimsPrincipal = new ClaimsPrincipal();
    // const identity: ClaimsIdentity = new ClaimsIdentity(
    //   'Application.Identity',
    //   ClaimTypes.Name,
    //   ClaimTypes.Role
    // );
    // user.AddIdentity(identity);

    const defaultAuthenticate =
      this.AuthenticationOptions.DefaultAuthenticateScheme ??
      this.AuthenticationOptions.DefaultScheme;

    if (!IsNullOrUndefined(defaultAuthenticate)) {
      const result = await this.AuthenticationService.Authenticate(
        context,
        defaultAuthenticate
      );
      context.User = result.Principal;
    }
    next();
  }
}
