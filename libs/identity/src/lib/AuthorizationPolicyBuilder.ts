import { AuthorizationPolicy } from './AuthorizationPolicy';
import { ClaimsAuthorizationRequirement } from './ClaimsAuthorizationRequirement';
import { IAuthorizationRequirement } from './IAuthorizationRequirement';
import { RolesAuthorizationRequirement } from './RolesAuthorizationRequirement';

export class AuthorizationPolicyBuilder {
  public Requirements: IAuthorizationRequirement[] = [];
  public RequireRole(...allowedRoles: string[]): AuthorizationPolicyBuilder {
    this.Requirements.push(new RolesAuthorizationRequirement(allowedRoles));
    return this;
  }
  public RequireClaim(
    claimName: string,
    ...values: any[]
  ): AuthorizationPolicyBuilder {
    this.Requirements.push(
      new ClaimsAuthorizationRequirement(claimName, values)
    );
    return this;
  }
  public RequireAssertion(context: any): AuthorizationPolicyBuilder {
    return this;
  }
  public RequireUserName(context: any): AuthorizationPolicyBuilder {
    return this;
  }
  public RequireAuthenticatedUser(): AuthorizationPolicyBuilder {
    return this;
  }
  public AddRequirements(): AuthorizationPolicyBuilder {
    return this;
  }
  public Build(): AuthorizationPolicy {
    return new AuthorizationPolicy();
  }
}
