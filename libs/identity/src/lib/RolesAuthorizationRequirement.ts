import { AuthorizationHandler } from './AuthorizationHandler';
import { AuthorizationHandlerContext } from './AuthorizationHandlerContext';
import { IAuthorizationRequirement } from './IAuthorizationRequirement';

export class RolesAuthorizationRequirement
  extends AuthorizationHandler<RolesAuthorizationRequirement>
  implements IAuthorizationRequirement
{
  constructor(private allowedRoles: string[]) {
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
    if (context.User.IsInRole(this.allowedRoles)) {
      context.User.Print();
      context.Succeed(requirement);
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public override toString(): string {
    const roles = `User.IsInRole must be true for one of the following roles: (${this.allowedRoles.join(
      ' | '
    )})`;
    return `{RolesAuthorizationRequirement}:${roles}`;
  }
}
