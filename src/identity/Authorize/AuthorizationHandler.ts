import { AuthorizationHandlerContext } from "./AuthorizationHandlerContext";
import { IAuthorizationHandler } from "./IAuthorizationHandler";
import { IAuthorizationRequirement } from "./IAuthorizationRequirement";


export abstract class AuthorizationHandler<T extends IAuthorizationRequirement> extends IAuthorizationHandler {
	Handle(context: AuthorizationHandlerContext): void {
		context.Requirements.forEach(req => {
			this.HandleRequirement(context, req as any);
		});
	}
	abstract HandleRequirement(context: AuthorizationHandlerContext, requirement: T): void;
}
