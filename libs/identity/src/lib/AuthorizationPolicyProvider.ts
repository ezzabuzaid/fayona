import { AuthorizationOptions } from './AuthorizationOptions';
import { AuthorizationPolicy } from './AuthorizationPolicy';

// .net source code
// First use for this interface is to resolve policies as async Task.FromResult() which is useless in our case
// Second use is let the user provide his own policy provider
export interface IAuthorizationPolicyProvider {
  GetPolicy(policyName: string): AuthorizationPolicy | undefined;
  GetDefaultPolicy(): AuthorizationPolicy;
  GetFallbackPolicy(): AuthorizationPolicy | undefined;
}

export class DefaultAuthorizationPolicyProvider
  implements IAuthorizationPolicyProvider
{
  constructor(private AuthorizeOptions: AuthorizationOptions) {}
  public GetPolicy(policyName: string): AuthorizationPolicy | undefined {
    return this.AuthorizeOptions.GetPolicy(policyName);
  }
  public GetDefaultPolicy(): AuthorizationPolicy {
    return this.AuthorizeOptions.DefaultPolicy;
  }
  public GetFallbackPolicy(): AuthorizationPolicy | undefined {
    return this.AuthorizeOptions.DefaultPolicy;
  }
}
