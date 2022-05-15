import { Action } from '@fayona/core';
import { Fayona } from '@fayona/routing';
import { RequestHandler } from 'express';

import { IAuthenticationOptions } from './lib';
import { AuthenticationMiddleware } from './lib/Authentication/AuthenticationMiddleware';

export * from './lib/Authentication';
export * from './lib/Helpers/passport';

declare module '@fayona/routing' {
  export interface IFayona {
    Authentication?(
      configure: Action<IAuthenticationOptions, void>
    ): RequestHandler;
  }
}

const prototype: import('@fayona/routing').IFayona = Fayona.prototype as any;
prototype.Authentication = AuthenticationMiddleware;
