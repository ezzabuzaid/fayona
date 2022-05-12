import { ArgumentNullException, IsNullOrUndefined } from '@fayona/core';
import { ServiceType } from 'tiny-injector';

import { IAuthenticationHandler } from './IAuthenticationHandler';

export class AuthenticationScheme {
  constructor(
    public HandlerType: ServiceType<IAuthenticationHandler>,
    public Name: string,
    public DisplayName?: string
  ) {
    if (IsNullOrUndefined(AuthenticationScheme)) {
      throw new ArgumentNullException('Name');
    }
    if (IsNullOrUndefined(HandlerType)) {
      throw new ArgumentNullException('HandlerType');
    }
    // eslint-disable-next-line no-prototype-builtins
    if (HandlerType.isPrototypeOf(IAuthenticationHandler)) {
      throw new ArgumentNullException(
        'handlerType must implement IAuthenticationHandler.'
      );
    }
  }
}
