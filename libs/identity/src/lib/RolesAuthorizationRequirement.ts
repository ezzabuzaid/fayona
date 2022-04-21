import { AuthorizationHandler } from './AuthorizationHandler';
import { AuthorizationHandlerContext } from './AuthorizationHandlerContext';
import { IAuthorizationRequirement } from './IAuthorizationRequirement';

export class RolesAuthorizationRequirement
  extends AuthorizationHandler<RolesAuthorizationRequirement>
  implements IAuthorizationRequirement
{
  constructor(private AllowedRoles: readonly string[]) {
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
    let found = false;
    if (!this.AllowedRoles?.length) {
      // let it fail
    } else {
      found = this.AllowedRoles.some((role) => context.User.IsInRole(role));
    }
    if (found) {
      context.Succeed(requirement);
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public override toString(): string {
    const roles = `User.IsInRole must be true for one of the following roles: (${this.AllowedRoles.join(
      ' | '
    )})`;
    return `{RolesAuthorizationRequirement}:${roles}`;
  }
}
