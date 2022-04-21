import { Inject } from 'tiny-injector';

import { AuthorizationEvaluator } from './AuthorizationEvaluator';
import { AuthorizationHandlerContext } from './AuthorizationHandlerContext';
import { AuthorizationResult } from './AuthorizationResult';
import { ClaimsPrincipal } from './Claims/ClaimsPrincipal';
import { IAuthorizationHandler } from './IAuthorizationHandler';
import { IAuthorizationRequirement } from './IAuthorizationRequirement';

export class AuthorizationService {
  constructor(
    public AuthorizationOptions: import('./AuthorizationOptions').AuthorizationOptions,
    @Inject(IAuthorizationHandler) private Handlers: IAuthorizationHandler[],
    private Evaluator: AuthorizationEvaluator
  ) {}
  // Will run for each policy for a givin endpoint
  public Authorize(
    user: ClaimsPrincipal,
    requirements: IAuthorizationRequirement[]
  ): AuthorizationResult {
    const authContext = new AuthorizationHandlerContext(requirements, user);
    for (const handler of this.Handlers) {
      handler.Handle(authContext);
      if (
        !this.AuthorizationOptions.InvokeHandlersAfterFailure &&
        authContext.HasFailed
      ) {
        break;
      }
    }
    const result = this.Evaluator.Evaluate(authContext);
    console.log(result);
    // Log the result, see in details
    // src/Security/Authorization/Core/src/LoggingExtensions.cs
    return result;
  }
}
