import { AuthorizationHandler } from "./AuthorizationHandler";
import { AuthorizationHandlerContext } from "./AuthorizationHandlerContext";
import { IAuthorizationRequirement } from "./IAuthorizationRequirement";


export class ClaimsAuthorizationRequirement extends AuthorizationHandler<ClaimsAuthorizationRequirement> implements IAuthorizationRequirement {
	constructor(
		public ClaimType: string,
		public AllowedValues: string[] | null,
	) {
		super();
	}

	public override	HandleRequirement(context: AuthorizationHandlerContext, requirement: ClaimsAuthorizationRequirement): void {
		let found = false;
		if (requirement.AllowedValues == null || requirement.AllowedValues.length === 0) {
			context.User.HasClaim(requirement.ClaimType, null)
		} else {
			context.User.HasClaim(requirement.ClaimType, requirement.AllowedValues);
		}
		if (found) {
			context.Succeed(requirement);
		}
	}

	public toString() {
		var value = (this.AllowedValues == null || this.AllowedValues.length === 0)
			? ""
			: `and Claim.Value is one of the following values: (${this.AllowedValues.join(" | ")})`;

		return `{nameof(ClaimsAuthorizationRequirement)}:Claim.Type=${this.ClaimType}${value}`;
	}
}
