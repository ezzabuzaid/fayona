import { AuthorizationFailureReason } from './AuthorizationFailureReason';
import { IAuthorizationRequirement } from './IAuthorizationRequirement';

export class AuthorizationFailure {
  public FailedRequirements: IAuthorizationRequirement[] = [];
  public FailureReasons: AuthorizationFailureReason[] = [];
  private constructor(public failCalled?: boolean) {}

  public static ExplicitFail(): AuthorizationFailure {
    return new AuthorizationFailure(true);
  }

  public static Failed(options: {
    FailedRequirements?: IAuthorizationRequirement[];
    Reasons?: AuthorizationFailureReason[];
  }): AuthorizationFailure {
    const authorizationFailure = new AuthorizationFailure(true);
    authorizationFailure.FailureReasons = options.Reasons ?? [];
    authorizationFailure.FailedRequirements = options.FailedRequirements ?? [];
    return authorizationFailure;
  }
}
