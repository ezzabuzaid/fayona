import { ClaimsPrincipal } from '../Claims';
import { AuthenticationProperties } from './AuthenticateResult';

export abstract class IAuthenticationHandler {
  public abstract Authenticate(): Promise<ClaimsPrincipal>;
  public abstract Challenge?(
    properties?: AuthenticationProperties
  ): Promise<void>;
  public abstract Forbid?(properties?: AuthenticationProperties): Promise<void>;
}
