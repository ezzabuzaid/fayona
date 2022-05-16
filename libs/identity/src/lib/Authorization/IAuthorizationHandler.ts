import { AuthorizationHandlerContext } from './AuthorizationHandlerContext';

export abstract class IAuthorizationHandler {
  public abstract Handle(context: AuthorizationHandlerContext): void;
}
