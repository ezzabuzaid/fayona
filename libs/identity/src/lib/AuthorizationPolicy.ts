import { IAuthorizationRequirement } from './IAuthorizationRequirement';

export class AuthorizationPolicy {
  constructor(public Requirements: readonly IAuthorizationRequirement[]) {}
}
