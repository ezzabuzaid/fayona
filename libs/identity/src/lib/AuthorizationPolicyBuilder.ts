import * as passport from 'passport';

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
  public AddRequirements(): AuthorizationPolicyBuilder {
    return this;
  }
  public AddAuthenticationSchemes(
    schemes: string[]
  ): AuthorizationPolicyBuilder {
    this.AuthenticationSchemes.push(...schemes);
    return this;
  }

  public Build(): AuthorizationPolicy {
    return new AuthorizationPolicy(this.Requirements);
  }
}
