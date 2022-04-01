import { AuthorizationFailure } from "./AuthorizationFailure";
import { AuthorizationHandlerContext } from "./AuthorizationHandlerContext";
import { AuthorizationResult } from "./AuthorizationResult";


export class AuthorizationEvaluator {
	Evaluate(context: AuthorizationHandlerContext): AuthorizationResult {
		return context.HasSucceeded
			? AuthorizationResult.Success()
			: AuthorizationResult.Failed(context.HasFailed
				? AuthorizationFailure.Failed({ reasons: context.FailureReasons })
				: AuthorizationFailure.Failed({ failedRequirements: context.PendingRequirements }));
	}
}
