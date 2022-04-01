import { AuthorizationHandlerContext } from "./AuthorizationHandlerContext";

export abstract class IAuthorizationHandler {
	abstract Handle(context: AuthorizationHandlerContext): void;
}


