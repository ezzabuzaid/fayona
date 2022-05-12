import { ArgumentNullException, IsNullOrUndefined } from '@fayona/core';

import { AuthorizationPolicy } from './AuthorizationPolicy';
import { ClaimsAuthorizationRequirement } from './ClaimsAuthorizationRequirement';
import { DenyAnonymousAuthorizationRequirement } from './DenyAnonymousAuthorizationRequirement';
import { IAuthorizationRequirement } from './IAuthorizationRequirement';
import { RolesAuthorizationRequirement } from './RolesAuthorizationRequirement';

export class AuthorizationPolicyBuilder {
  public AuthenticationSchemes: string[] = [];
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
    this.Requirements.push(new DenyAnonymousAuthorizationRequirement());
    return this;
  }
  public AddRequirements(
    ...requirements: IAuthorizationRequirement[]
  ): AuthorizationPolicyBuilder {
    return this;
  }
  public AddAuthenticationSchemes(
    ...schemes: string[]
  ): AuthorizationPolicyBuilder {
    this.AuthenticationSchemes.push(...schemes);
    return this;
  }

  public Build(): AuthorizationPolicy {
    return new AuthorizationPolicy(
      this.Requirements,
      this.AuthenticationSchemes
    );
  }

  public Combine(policy: AuthorizationPolicy): AuthorizationPolicyBuilder {
    if (IsNullOrUndefined(policy)) {
      throw new ArgumentNullException('policy');
    }

    this.AddAuthenticationSchemes(...policy.AuthenticationSchemes);
    this.AddRequirements(...policy.Requirements);

    return this;
  }
}
