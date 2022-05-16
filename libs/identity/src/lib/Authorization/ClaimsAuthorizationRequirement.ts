import { AuthorizationHandler } from './AuthorizationHandler';
import { AuthorizationHandlerContext } from './AuthorizationHandlerContext';
import { IAuthorizationRequirement } from './IAuthorizationRequirement';

export class ClaimsAuthorizationRequirement
  extends AuthorizationHandler<ClaimsAuthorizationRequirement>
  implements IAuthorizationRequirement
{
  constructor(public ClaimType: string, public AllowedValues: string[] | null) {
    super();
  }

  public override HandleRequirement(
    context: AuthorizationHandlerContext,
    requirement: ClaimsAuthorizationRequirement
  ): void {
    let found = false;
    if (
      requirement.AllowedValues == null ||
      requirement.AllowedValues.length === 0
    ) {
      found = context.User.HasClaim(requirement.ClaimType);
    } else {
      found = context.User.HasClaim(
        (claim) =>
          claim.Type === this.ClaimType &&
          this.AllowedValues!.includes(claim.Value)
      );
    }
    if (found) {
      context.Succeed(requirement);
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public override toString(): string {
    const value =
      this.AllowedValues == null || this.AllowedValues.length === 0
        ? ''
        : `and Claim.Value is one of the following values: (${this.AllowedValues.join(
            ' | '
          )})`;

    return `{nameof(ClaimsAuthorizationRequirement)}:Claim.Type=${this.ClaimType}${value}`;
  }
}
