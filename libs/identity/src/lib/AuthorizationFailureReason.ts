import { IAuthorizationHandler } from './IAuthorizationHandler';

export class AuthorizationFailureReason {
  constructor(public handler: IAuthorizationHandler, public message: string) {}
}
