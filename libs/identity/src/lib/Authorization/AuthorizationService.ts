import { Inject } from 'tiny-injector';

import { ClaimsPrincipal } from '../Claims';
import { AuthorizationEvaluator } from './AuthorizationEvaluator';
import { AuthorizationHandlerContext } from './AuthorizationHandlerContext';
import { AuthorizationOptions } from './AuthorizationOptions';
import { AuthorizationPolicy } from './AuthorizationPolicy';
import { AuthorizationResult } from './AuthorizationResult';
import { IAuthorizationHandler } from './IAuthorizationHandler';

export class AuthorizationService {
  public AuthorizationOptions: AuthorizationOptions;
  constructor(
    authorizationOptions: AuthorizationOptions,
    @Inject(IAuthorizationHandler) private Handlers: IAuthorizationHandler[],
    private Evaluator: AuthorizationEvaluator
  ) {
    this.AuthorizationOptions = authorizationOptions;
  }

  // Will run for each policy for a givin endpoint
  public Authorize(
    user: ClaimsPrincipal,
    policy: AuthorizationPolicy
  ): AuthorizationResult {
    const authContext = new AuthorizationHandlerContext(
      policy.Requirements,
      user
    );
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
    // Log the result, see in details
    // src/Security/Authorization/Core/src/LoggingExtensions.cs
    return result;
  }
}
