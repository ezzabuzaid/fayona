import { Inject } from "tiny-injector";
import { AuthorizationEvaluator } from "./AuthorizationEvaluator";
import { AuthorizationHandlerContext } from "./AuthorizationHandlerContext";
import { AuthorizationOptions } from "./AuthorizationOptions";
import { AuthorizationResult } from "./AuthorizationResult";
import { ClaimsPrincipal } from "./ClaimsPrincipal";
import { IAuthorizationHandler } from "./IAuthorizationHandler";
import { IAuthorizationRequirement } from "./IAuthorizationRequirement";

export class AuthorizationService {
	constructor(
		private authorizationOptions: AuthorizationOptions,
		@Inject(IAuthorizationHandler) private handlers: IAuthorizationHandler[],
		private evaluator: AuthorizationEvaluator
	) { }
	// Will run for each policy for a givin endpoint
	public Authorize(
		user: ClaimsPrincipal,
		requirements: IAuthorizationRequirement[]
	): AuthorizationResult {
		const authContext = new AuthorizationHandlerContext(requirements, user);
		for (const handler of this.handlers) {
			handler.Handle(authContext);
			if (!this.authorizationOptions.InvokeHandlersAfterFailure && authContext.HasFailed) {
				break;
			}
		}
		const result = this.evaluator.Evaluate(authContext);
		console.log(result)
		return result;
	}

}


