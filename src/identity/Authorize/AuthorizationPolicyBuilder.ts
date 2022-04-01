import { AuthorizationPolicy } from "./AuthorizationPolicy";
import { ClaimsAuthorizationRequirement } from "./ClaimsAuthorizationRequirement";
import { IAuthorizationRequirement } from "./IAuthorizationRequirement";
import { RolesAuthorizationRequirement } from "./RolesAuthorizationRequirement";

export class AuthorizationPolicyBuilder {
	public Requirements: IAuthorizationRequirement[] = [];
	public RequireRole(...allowedRoles: string[]) {
		this.Requirements.push(new RolesAuthorizationRequirement(allowedRoles));
		return this;
	}
	public RequireClaim(claimName: string, ...values: any[]) {
		this.Requirements.push(new ClaimsAuthorizationRequirement(claimName, values))
		return this;
	}
	public RequireAssertion(context: any) { }
	public RequireUserName(context: any) { }
	public RequireAuthenticatedUser() {
		return this;
	}
	public AddRequirements() { }
	public Build(): AuthorizationPolicy {
		return new AuthorizationPolicy();
	}
}
