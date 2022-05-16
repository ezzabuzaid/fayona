import { Action, Fayona } from '@fayona/core';
import { RequestHandler } from 'express';

import type { IAuthenticationOptions } from './lib/Authentication';
import { AuthenticationMiddleware } from './lib/Authentication/AuthenticationMiddleware';
import type { ClaimsPrincipal } from './lib/Claims';

export * from './lib/Claims';

export * from './lib/Authentication';
export * from './lib/Authorization';
export * from './lib/Helpers/passport';

declare module '@fayona/core' {
  interface IHttpContext {
    User?: ClaimsPrincipal;
  }
  export interface IFayona {
    Authentication(
      configure: Action<IAuthenticationOptions, void>
    ): RequestHandler;
  }
}

const prototype: import('@fayona/core').IFayona = Fayona.prototype as any;

prototype.Authentication = AuthenticationMiddleware;
