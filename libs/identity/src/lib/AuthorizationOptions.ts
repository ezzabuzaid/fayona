import { Action } from '@fayona/utils';
import { Injectable } from 'tiny-injector';

import { AuthorizationPolicy } from './AuthorizationPolicy';
import { AuthorizationPolicyBuilder } from './AuthorizationPolicyBuilder';

@Injectable()
export class AuthorizationOptions {
  public InvokeHandlersAfterFailure = true;
  public FallbackPolicy?: AuthorizationPolicy;
  public DefaultPolicy: AuthorizationPolicy = new AuthorizationPolicyBuilder()
    .RequireAuthenticatedUser()
    .Build();

  public RoleClaimType = 'role';

  #PolicyMap: Record<string, AuthorizationPolicyBuilder> = {};

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

  public GetPolicy(policyName: string): AuthorizationPolicy | undefined {
    return this.#PolicyMap[policyName];
  }
}
