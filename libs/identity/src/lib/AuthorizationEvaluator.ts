import { AuthorizationFailure } from './AuthorizationFailure';
import { AuthorizationHandlerContext } from './AuthorizationHandlerContext';
import { AuthorizationResult } from './AuthorizationResult';

export class AuthorizationEvaluator {
  public Evaluate(context: AuthorizationHandlerContext): AuthorizationResult {
    return context.HasSucceeded
      ? AuthorizationResult.Success()
      : AuthorizationResult.Failed(
          context.HasFailed
            ? AuthorizationFailure.Failed({ Reasons: context.FailureReasons })
            : AuthorizationFailure.Failed({
                FailedRequirements: context.PendingRequirements,
              })
        );
  }
}
