import {
  AuthenticateResult,
  AuthenticationProperties,
} from './AuthenticateResult';

export abstract class IAuthenticationHandler {
  public abstract Initialize(): Promise<void>;
  public abstract Authenticate(): Promise<AuthenticateResult>;
  public abstract Challenge(
    properties?: AuthenticationProperties
  ): Promise<void>;
  public abstract Forbid(properties?: AuthenticationProperties): Promise<void>;
}
