import { Injectable } from "tiny-injector";
import { Action } from "../../utils";
import { AuthorizationPolicy } from "./AuthorizationPolicy";
import { AuthorizationPolicyBuilder } from "./AuthorizationPolicyBuilder";

@Injectable()
export class AuthorizationOptions {
    public InvokeHandlersAfterFailure: boolean = true;
    public DefaultPolicy: AuthorizationPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    public FallbackPolicy?: AuthorizationPolicy;
    #PolicyMap: Record<string, AuthorizationPolicyBuilder> = {};
    RoleClaimType: string = 'role';



    public AddPolicy(policyName: string, policy: AuthorizationPolicy): void;
    public AddPolicy(policyName: string, configurePolicy: Action<AuthorizationPolicyBuilder>): void;
    public AddPolicy(policyName: string, policyOrConfigurePolicy: AuthorizationPolicy | Action<AuthorizationPolicyBuilder>): void {
        const policy = new AuthorizationPolicyBuilder();
        if (!(policyOrConfigurePolicy instanceof AuthorizationPolicy)) {
            policyOrConfigurePolicy(policy);
        }
        this.#PolicyMap[policyName] = policy;
    }

    public GetPolicy(policyName: string) {
        return this.#PolicyMap[policyName];
    }

}



