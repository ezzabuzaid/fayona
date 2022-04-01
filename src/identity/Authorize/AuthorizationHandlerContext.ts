import { AuthorizationFailureReason } from "./AuthorizationFailureReason";
import { ClaimsPrincipal } from "./ClaimsPrincipal";
import { IAuthorizationHandler } from "./IAuthorizationHandler";
import { IAuthorizationRequirement } from "./IAuthorizationRequirement";

export class AuthorizationHandlerContext {
	#failCalled?: boolean;
	#succeedCalled?: boolean;
	PendingRequirements: IAuthorizationRequirement[];
	FailureReasons: AuthorizationFailureReason[] = [];
	constructor(
		// Requirements can be both simple Requirement and AuthorizationHandler
		// PassThroughAuthorizationHandler will help in invoking requirments that are AuthorizationHandler
		public Requirements: IAuthorizationRequirement[] = [],
		public User: ClaimsPrincipal
	) {
		this.PendingRequirements = this.Requirements.slice(0);
	}

	public get HasFailed() {
		return this.#failCalled;
	}

	public get HasSucceeded() {
		return !this.#failCalled && this.#succeedCalled && this.PendingRequirements.length < 1;
	}

	public Fail(reason?: AuthorizationFailureReason) {
		this.#failCalled = true;
		if (reason) {
			this.FailureReasons.push(reason);
		}
	}

	public Succeed(requirement: IAuthorizationHandler) {
		this.#succeedCalled = true;
		const requirementIndex = this.PendingRequirements.findIndex(it => it === requirement);
		this.PendingRequirements.splice(requirementIndex, 1);
	}
}
