import {
  AuthenticateResult,
  AuthenticationProperties,
} from './AuthenticateResult';

export abstract class IAuthenticationHandler {
  public abstract InitializeAsync(): void;
  public abstract AuthenticateAsync(): AuthenticateResult;
  public abstract ChallengeAsync(properties?: AuthenticationProperties): void;
  public abstract ForbidAsync(properties?: AuthenticationProperties): void;
}
