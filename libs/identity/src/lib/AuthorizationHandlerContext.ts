import { ClaimsPrincipal } from '@fayona/core';

import { AuthorizationFailureReason } from './AuthorizationFailureReason';
import { IAuthorizationHandler } from './IAuthorizationHandler';
import { IAuthorizationRequirement } from './IAuthorizationRequirement';

export class AuthorizationHandlerContext {
  #FailCalled?: boolean;
  #SucceedCalled?: boolean;
  public PendingRequirements: IAuthorizationRequirement[];
  public FailureReasons: AuthorizationFailureReason[] = [];
  constructor(
    // Requirements can be both simple Requirement and AuthorizationHandler
    // PassThroughAuthorizationHandler will help in invoking requirments that are AuthorizationHandler
    public Requirements: readonly IAuthorizationRequirement[] = [],
    public User: ClaimsPrincipal
  ) {
    this.PendingRequirements = this.Requirements.slice(0);
  }

  public get HasFailed(): boolean | undefined {
    return this.#FailCalled;
  }

  public get HasSucceeded(): boolean | undefined {
    return (
      !this.#FailCalled &&
      this.#SucceedCalled &&
      this.PendingRequirements.length < 1
    );
  }

  public Fail(reason?: AuthorizationFailureReason): void {
    this.#FailCalled = true;
    if (reason) {
      this.FailureReasons.push(reason);
    }
  }

  public Succeed(requirement: IAuthorizationHandler): void {
    this.#SucceedCalled = true;
    const requirementIndex = this.PendingRequirements.findIndex(
      (it) => it === requirement
    );
    this.PendingRequirements.splice(requirementIndex, 1);
  }
}
