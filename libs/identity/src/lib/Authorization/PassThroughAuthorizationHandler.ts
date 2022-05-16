import { AuthorizationHandler } from "./AuthorizationHandler";
import { AuthorizationHandlerContext } from "./AuthorizationHandlerContext";
import { IAuthorizationHandler } from "./IAuthorizationHandler";


export class PassThroughAuthorizationHandler extends IAuthorizationHandler {

	public Handle(context: AuthorizationHandlerContext): void {
		for (const handler of context.Requirements) {
			if (handler instanceof AuthorizationHandler) {
				handler.Handle(context);
			}
		}
	}

}
