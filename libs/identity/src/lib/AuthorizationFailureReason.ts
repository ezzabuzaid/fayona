import { IAuthorizationHandler } from './IAuthorizationHandler';

export class AuthorizationFailureReason {
  constructor(public Handler: IAuthorizationHandler, public Message: string) {}
}
