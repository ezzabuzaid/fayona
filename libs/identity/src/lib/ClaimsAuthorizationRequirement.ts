import { AuthorizationHandler } from './AuthorizationHandler';
import { AuthorizationHandlerContext } from './AuthorizationHandlerContext';
import { IAuthorizationRequirement } from './IAuthorizationRequirement';

export class ClaimsAuthorizationRequirement
  extends AuthorizationHandler<ClaimsAuthorizationRequirement>
  implements IAuthorizationRequirement
{
  constructor(public claimType: string, public allowedValues: string[] | null) {
    super();
  }

  public override HandleRequirement(
    context: AuthorizationHandlerContext,
    requirement: ClaimsAuthorizationRequirement
  ): void {
    const found = false;
    if (
      requirement.allowedValues == null ||
      requirement.allowedValues.length === 0
    ) {
      context.User.HasClaim(requirement.claimType, null);
    } else {
      context.User.HasClaim(requirement.claimType, requirement.allowedValues);
    }
    if (found) {
      context.Succeed(requirement);
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public override toString(): string {
    const value =
      this.allowedValues == null || this.allowedValues.length === 0
        ? ''
        : `and Claim.Value is one of the following values: (${this.allowedValues.join(
            ' | '
          )})`;

    return `{nameof(ClaimsAuthorizationRequirement)}:Claim.Type=${this.claimType}${value}`;
  }
}
