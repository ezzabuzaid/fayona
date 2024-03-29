import { InvalidOperationException, IsNullOrUndefined } from '@fayona/core';
import { IHttpContext } from '@fayona/core';
import { Context, Injectable, Injector, ServiceLifetime } from 'tiny-injector';

import { ClaimsPrincipal } from '../Claims';
import { AuthenticationProperties } from './AuthenticateResult';
import { IAuthenticationOptions } from './AuthenticationOptions';
import { AuthenticationSchemeProvider } from './AuthenticationSchemeProvider';
import { IAuthenticationHandler } from './IAuthenticationHandler';
import { IAuthenticationService } from './IAuthenticationService';

@Injectable({
  lifetime: ServiceLifetime.Scoped,
})
export class AuthenticationService extends IAuthenticationService {
  public readonly AuthenticationSchemeProvider: AuthenticationSchemeProvider;
  constructor(
    private readonly AuthenticationOptions: IAuthenticationOptions,
    authenticationSchemeProvider: AuthenticationSchemeProvider,
    private context: Context
  ) {
    super();
    this.AuthenticationSchemeProvider = authenticationSchemeProvider;
  }

  public override async Authenticate(
    context: IHttpContext,
    scheme?: string | undefined
  ): Promise<ClaimsPrincipal> {
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

  private GetHandler(
    context: IHttpContext,
    scheme: string
  ): IAuthenticationHandler | undefined {
    const authenticationScheme = this.AuthenticationOptions.Schemas.find(
      (item) => item.Name === scheme
    );
    if (authenticationScheme) {
      return Injector.GetRequiredService(
        authenticationScheme.HandlerType,
        this.context
      );
    }
    return undefined;
  }
}
