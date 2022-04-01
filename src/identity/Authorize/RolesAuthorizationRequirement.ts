import { AuthorizationHandler } from "./AuthorizationHandler";
import { AuthorizationHandlerContext } from "./AuthorizationHandlerContext";
import { IAuthorizationRequirement } from "./IAuthorizationRequirement";

export class RolesAuthorizationRequirement
	extends AuthorizationHandler<RolesAuthorizationRequirement>
	implements IAuthorizationRequirement
{
	constructor(private AllowedRoles: string[]) {
		super();
		// if (allowedRoles == null) {
		//     throw new ArgumentNullException('allowedRoles');
		// }
		// if (allowedRoles.length == 0) {
		//     throw new InvalidOperationException('RoleRequirementEmpty');
		// }
	}

	public override HandleRequirement(
		context: AuthorizationHandlerContext,
		requirement: RolesAuthorizationRequirement
	): void {
		if (context.User.IsInRole(this.AllowedRoles)) {
			context.User.Print();
			context.Succeed(requirement);
		}
	}

	public toString() {
		var roles = `User.IsInRole must be true for one of the following roles: (${this.AllowedRoles.join(
			" | "
		)})`;
		return `{RolesAuthorizationRequirement}:${roles}`;
	}
}
