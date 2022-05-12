import {
  CoerceArray,
  CoreInjector,
  HttpEndpointMetadata,
  InvalidOperationException,
  IsNullOrEmpty,
  IsNullOrUndefined,
  MakeHandlerName,
  Metadata,
} from '@fayona/core';

import { IAuthenticationOptions } from '../Authentication/AuthenticationOptions';
import { AuthorizationOptions } from '../AuthorizationOptions';
import { IAuthorizeData } from '../IAuthorizeData';

export function Authorize(authorizeData?: IAuthorizeData): any {
  const authorizationOptions =
    CoreInjector.GetRequiredService(AuthorizationOptions);
  const metadata = CoreInjector.GetRequiredService(Metadata);
  const policyName = authorizeData?.Policy;

  if (policyName) {
    const policy = authorizationOptions.GetPolicy(policyName);
    if (!policy) {
      throw new InvalidOperationException(
        `Policy for ${policyName} is not exist.`
      );
    }
  }

  return (target: Object, propertyKey: string): void => {
    const authenticationOptions = CoreInjector.GetRequiredService(
      IAuthenticationOptions
    );
    const { endpoints } = metadata.GetHttpRoute(
      (item) => item.controller === target
    );
    const endpoint = endpoints.find(
      (item) =>
        MakeHandlerName(item.controller, item.handler!.name) ===
        MakeHandlerName(target.constructor, propertyKey)
    );

    if (IsNullOrUndefined(endpoint)) {
      throw new InvalidOperationException(
        `${propertyKey} is not decorated with an Http Action.`
      );
    }

    const list: IAuthorizeData[] =
      endpoint.Properties.get(IAuthorizeData) ?? [];
    list.push({});
    endpoint.Properties.set(IAuthorizeData, list);

    // the below lines should be replaced by "RequireAuthenticatedUsers"
    // const middleware = passport.authenticate(strategyName, { session: false });
    // metadata.RegisterAuthorize(endpointId, middleware);
  };
}

function IsDefined(authorizeData?: IAuthorizeData): boolean {
  if (!authorizeData) {
    return false;
  }

  if (authorizeData.Policy) {
    return true;
  }

  if (
    CoerceArray(authorizeData.AuthenticationSchemes).filter(
      (item) => !IsNullOrUndefined(item) && !IsNullOrEmpty(item)
    ).length
  ) {
    return true;
  }

  if (
    CoerceArray(authorizeData.Roles).filter(
      (item) => !IsNullOrUndefined(item) && !IsNullOrEmpty(item)
    ).length
  ) {
    return true;
  }

  return false;
}
