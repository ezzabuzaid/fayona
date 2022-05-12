import {
  ClaimsPrincipal,
  HttpContext,
  InvalidOperationException,
  IsNullOrUndefined,
} from '@fayona/core';

import { IdentityInjector } from '../IdentityInjector';
import {
  AuthenticateResult,
  AuthenticationProperties,
} from './AuthenticateResult';
import { IAuthenticationOptions } from './AuthenticationOptions';
import { AuthenticationScheme } from './AuthenticationScheme';
import { AuthenticationSchemeProvider } from './AuthenticationSchemeProvider';
import { AuthenticationTicket } from './AuthenticationTicket';
import { IAuthenticationHandler } from './IAuthenticationHandler';
import { IAuthenticationService } from './IAuthenticationService';

export class AuthenticationService extends IAuthenticationService {
  public readonly AuthenticationSchemeProvider: AuthenticationSchemeProvider;
  constructor(
    private readonly AuthenticationOptions: IAuthenticationOptions,
    authenticationSchemeProvider: AuthenticationSchemeProvider
  ) {
    super();
    this.AuthenticationSchemeProvider = authenticationSchemeProvider;
  }

  public override async Authenticate(
    context: HttpContext,
    scheme?: string | undefined
  ): Promise<AuthenticateResult> {
    if (IsNullOrUndefined(scheme)) {
      const defaultScheme =
        this.AuthenticationSchemeProvider.GetDefaultAuthenticateScheme();
      scheme = defaultScheme?.Name;
      if (IsNullOrUndefined(scheme)) {
        throw new InvalidOperationException(
          `No authenticationScheme was specified, and there was no DefaultAuthenticateScheme found.`
        );
      }
    }

    const handler = this.GetHandler(context, scheme);

    if (IsNullOrUndefined(handler)) {
      throw new InvalidOperationException(
        `Cannot find HandlerType for ${scheme}`
      );
    }
    const result = await handler.Authenticate();

    if (result.Succeeded) {
      return AuthenticateResult.Success(
        new AuthenticationTicket(
          result.Principal!,
          result.Properties!,
          result.Ticket!.AuthenticationScheme
        )
      );
    }

    return result;
  }

  public override Challenge(
    scheme: string | null,
    properties: AuthenticationProperties | null
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public override Forbid(
    scheme: string | null,
    properties: AuthenticationProperties | null
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public override SignIn(
    scheme: string | null,
    principal: ClaimsPrincipal | null,
    properties: AuthenticationProperties | null
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public override SignOut(
    scheme: string | null,
    properties: AuthenticationProperties | null
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // in the original source code this is sould be in IAuthenticationHandlerProvider
  private GetHandler(
    context: HttpContext,
    scheme: string
  ): IAuthenticationHandler | undefined {
    const authenticationScheme = this.AuthenticationOptions.Schemas.find(
      (item) => item.Name === scheme
    );
    if (authenticationScheme) {
      return context.RequestServices.GetRequiredService(
        authenticationScheme.HandlerType
      );
    }
    return undefined;
  }
}
