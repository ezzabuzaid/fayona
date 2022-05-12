import { ClaimsPrincipal, HttpContext } from '@fayona/core';

import {
  AuthenticateResult,
  AuthenticationProperties,
} from './AuthenticateResult';

export abstract class IAuthenticationService {
  /**
   * Authenticate for the specified authentication scheme.
   */
  public abstract Authenticate(
    context: HttpContext,
    scheme?: string
  ): Promise<AuthenticateResult>;

  /**
   *
   * Challenge the specified authentication scheme.
   * An authentication challenge can be issued when an unauthenticated user requests an endpoint that requires authentication.
   */
  public abstract Challenge(
    scheme: string | null,
    properties: AuthenticationProperties | null
  ): Promise<void>;

  /**
   * Forbids the specified authentication scheme.
   * Forbid is used when an authenticated user attempts to access a resource they are not permitted to access.
   */
  public abstract Forbid(
    scheme: string | null,
    properties: AuthenticationProperties | null
  ): Promise<void>;

  /**
   * Sign a principal in for the specified authentication scheme.
   */
  public abstract SignIn(
    scheme: string | null,
    principal: ClaimsPrincipal | null,
    properties: AuthenticationProperties | null
  ): Promise<void>;

  /**
   * Sign out the specified authentication scheme.
   */
  public abstract SignOut(
    scheme: string | null,
    properties: AuthenticationProperties | null
  ): Promise<void>;
}
