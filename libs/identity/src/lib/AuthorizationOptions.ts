import { Injectable } from 'tiny-injector';
import { AuthorizationPolicy } from './AuthorizationPolicy';
import { AuthorizationPolicyBuilder } from './AuthorizationPolicyBuilder';
import { Action } from './Utils';

@Injectable()
export class AuthorizationOptions {
  public InvokeHandlersAfterFailure = true;
  public DefaultPolicy: AuthorizationPolicy = new AuthorizationPolicyBuilder()
    .RequireAuthenticatedUser()
    .Build();
  public FallbackPolicy?: AuthorizationPolicy;
  #PolicyMap: Record<string, AuthorizationPolicyBuilder> = {};
  public RoleClaimType = 'role';

  public AddPolicy(policyName: string, policy: AuthorizationPolicy): void;
  public AddPolicy(
    policyName: string,
    configurePolicy: Action<AuthorizationPolicyBuilder>
  ): void;
  public AddPolicy(
    policyName: string,
    policyOrConfigurePolicy:
      | AuthorizationPolicy
      | Action<AuthorizationPolicyBuilder>
  ): void {
    const policy = new AuthorizationPolicyBuilder();
    if (!(policyOrConfigurePolicy instanceof AuthorizationPolicy)) {
      policyOrConfigurePolicy(policy);
    }
    this.#PolicyMap[policyName] = policy;
  }

  public GetPolicy(policyName: string): AuthorizationPolicy {
    return this.#PolicyMap[policyName];
  }
}
