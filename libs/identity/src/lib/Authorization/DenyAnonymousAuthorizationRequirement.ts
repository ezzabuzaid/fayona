import { AuthorizationHandler } from './AuthorizationHandler';
import { AuthorizationHandlerContext } from './AuthorizationHandlerContext';
import { IAuthorizationRequirement } from './IAuthorizationRequirement';

export class DenyAnonymousAuthorizationRequirement
  extends AuthorizationHandler<DenyAnonymousAuthorizationRequirement>
  implements IAuthorizationRequirement
{
  public HandleRequirement(
    context: AuthorizationHandlerContext,
    requirement: DenyAnonymousAuthorizationRequirement
  ): void {
    const user = context.User;
    const userIsAnonymous =
      user?.Identity == null || !user.Identities.some((i) => i.IsAuthenticated);
    if (!userIsAnonymous) {
      context.Succeed(requirement);
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public override toString(): string {
    return `${DenyAnonymousAuthorizationRequirement.name}: Requires an authenticated user.`;
  }
}
