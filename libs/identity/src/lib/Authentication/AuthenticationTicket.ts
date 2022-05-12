import {
  ArgumentNullException,
  ClaimsPrincipal,
  IsNullOrUndefined,
} from '@fayona/core';

import { AuthenticationProperties } from './AuthenticateResult';

export class AuthenticationTicket {
  public Principal: ClaimsPrincipal;
  public Properties: AuthenticationProperties;
  public AuthenticationScheme: string;

  constructor(
    principal: ClaimsPrincipal,
    properties: AuthenticationProperties,
    authenticationScheme: string
  ) {
    if (IsNullOrUndefined(principal)) {
      throw new ArgumentNullException('', 'principal');
    }
    this.Principal = principal;
    this.Properties = properties;
    this.AuthenticationScheme = authenticationScheme;
  }
}
