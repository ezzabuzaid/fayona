import passport from "passport";
import { Injector } from "tiny-injector";
import { Metadata } from "../../Routing/Metadata";
import { RoutingInjector } from "../../utils/Collections";
import { AuthenticationOptions } from "./AuthenticationOptions";
import { AuthorizationOptions } from "./AuthorizationOptions";


/**
 * Check if the user carry the intened roles
 *
 * Authorize("HRManager") only HRManager users are authorized to continue
 *
 * Authorize("HRManager", "Finance") only HRManager or Finance users are authorized to continue
 *
 * [Authorize("HRManager"), Authorize("Finance")] only users of both HRManager and Finance roles are authorized to continue
 *
 * Will throw Forbidden response in case of authenticated user but not authorized
 */
interface IAuthorizeData {
    StrategyName?: string;
    Role?: string[] | string;
    Claim?: string;
    Policy: string;
}

export const Authorize = (authorizeData?: IAuthorizeData): PropertyDecorator => {
    return (target, propertyKey) => {
        const authorizationOptions = RoutingInjector.GetRequiredService(AuthorizationOptions);
        const authenticationOptions = RoutingInjector.GetRequiredService(AuthenticationOptions);
        let strategyName = authorizeData?.StrategyName ?? authenticationOptions.DefaultStrategyName;
        let policyName = authorizeData?.Policy;
        const metadata = Injector.GetRequiredService(Metadata);
        if (policyName) {
            const policy = authorizationOptions.GetPolicy(policyName);
            if (policy) {
                metadata.RegisterPolicy(target.constructor, propertyKey as string, policy);
            }
        }
        // the below lines should be replaced by "RequireAuthenticatedUsers"
        const middleware = passport.authenticate(strategyName, { session: false })
        metadata.RegisterAuthorize(target.constructor, propertyKey as string, middleware);
    }
}
