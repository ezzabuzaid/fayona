import { ArgumentNullException, IsNullOrUndefined } from '@fayona/core';

import { AuthorizationPolicyBuilder } from './AuthorizationPolicyBuilder';
import { IAuthorizationRequirement } from './IAuthorizationRequirement';

export class AuthorizationPolicy {
  constructor(
    public Requirements: readonly IAuthorizationRequirement[],
    public AuthenticationSchemes: readonly string[]
  ) {}

  public static Combine(
    policies: readonly AuthorizationPolicy[]
  ): AuthorizationPolicy {
    if (IsNullOrUndefined(policies)) {
      throw new ArgumentNullException('policies');
    }

    const builder = new AuthorizationPolicyBuilder();

    for (const policy of policies) {
      builder.Combine(policy);
    }

    return builder.Build();
  }
}
