import { MakeHandlerName } from '@fayona/utils';
import * as passport from 'passport';
import { Injector } from 'tiny-injector';

import { AuthenticationOptions } from './Authentication/AuthenticationOptions';
import { AuthorizationOptions } from './AuthorizationOptions';
import { IAuthorizeData } from './IAuthorizeData';
import { IdentityInjector } from './IdentityServiceCollection';
import { Metadata } from './Metadata';

export function Authorize(authorizeData?: IAuthorizeData): any {
  return (target: Function, propertyKey: string): void => {
    // FIXME: throw error if UseAuthorization is not called
    const endpointId = MakeHandlerName(target, propertyKey);
    const authorizationOptions =
      IdentityInjector.GetRequiredService(AuthorizationOptions);
    const authenticationOptions = IdentityInjector.GetRequiredService(
      AuthenticationOptions
    );
    const strategyName =
      authorizeData?.StrategyName ?? authenticationOptions.DefaultStrategyName;
    const policyName = authorizeData?.Policy;
    const metadata = Injector.GetRequiredService(Metadata);
    if (policyName) {
      // FIXME: I do not know how, but no injector should be here
      // This decorator should be purly used as Annotation
      const policy = authorizationOptions.GetPolicy(policyName);
      if (policy) {
        metadata.RegisterPolicy(endpointId, policy);
      } else {
        // TODO: throw an error if the policy is not exist
      }
    }
    // the below lines should be replaced by "RequireAuthenticatedUsers"
    // const middleware = passport.authenticate(strategyName, { session: false });
    // metadata.RegisterAuthorize(endpointId, middleware);
  };
}
