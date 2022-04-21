import { ClaimsPrincipal } from '../Claims/ClaimsPrincipal';
import { AuthenticationProperties } from './AuthenticateResult';

export interface IAuthenticationService {
  /**
   * Authenticate for the specified authentication scheme.
   */
  AuthenticateAsync(scheme: string | null): void;

  /**
   *
   * Challenge the specified authentication scheme.
   * An authentication challenge can be issued when an unauthenticated user requests an endpoint that requires authentication.
   */
  ChallengeAsync(
    scheme: string | null,
    properties: AuthenticationProperties | null
  ): void;

  /**
   * Forbids the specified authentication scheme.
   * Forbid is used when an authenticated user attempts to access a resource they are not permitted to access.
   */
  ForbidAsync(
    scheme: string | null,
    properties: AuthenticationProperties | null
  ): void;

  /**
   * Sign a principal in for the specified authentication scheme.
   */
  SignInAsync(
    scheme: string | null,
    principal: ClaimsPrincipal | null,
    properties: AuthenticationProperties | null
  ): void;

  /**
   * Sign out the specified authentication scheme.
   */
  SignOutAsync(
    scheme: string | null,
    properties: AuthenticationProperties | null
  ): void;
}
