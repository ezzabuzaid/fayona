import { AuthorizationFailureReason } from "./AuthorizationFailureReason";
import { IAuthorizationRequirement } from "./IAuthorizationRequirement";


export class AuthorizationFailure {
	public FailedRequirements: IAuthorizationRequirement[] = [];
	public FailureReasons: AuthorizationFailureReason[] = [];
	private constructor(
		public FailCalled?: boolean
	) { }


	public static ExplicitFail(): AuthorizationFailure {
		return new AuthorizationFailure(true);
	}

	public static Failed({ failedRequirements, reasons }: {
		failedRequirements?: IAuthorizationRequirement[];
		reasons?: AuthorizationFailureReason[];
	}): AuthorizationFailure {
		const authorizationFailure = new AuthorizationFailure(true);
		authorizationFailure.FailureReasons = reasons ?? [];
		authorizationFailure.FailedRequirements = failedRequirements ?? [];
		return authorizationFailure;
	}

}
