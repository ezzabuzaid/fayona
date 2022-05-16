import { AuthorizationFailure } from "./AuthorizationFailure";


export class AuthorizationResult {
	public Failure?: AuthorizationFailure;
	constructor(
		public Succeeded: boolean | null
	) { }

	public static Success(): AuthorizationResult {
		return new AuthorizationResult(true);
	}

	public static Failed(failure: AuthorizationFailure = AuthorizationFailure.ExplicitFail()): AuthorizationResult {
		const authorizationResult = new AuthorizationResult(null);
		authorizationResult.Failure = failure;
		return authorizationResult;
	};

}
