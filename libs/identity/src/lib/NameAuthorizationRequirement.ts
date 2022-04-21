import { AuthorizationHandler } from './AuthorizationHandler';
import { AuthorizationHandlerContext } from './AuthorizationHandlerContext';
import { IAuthorizationRequirement } from './IAuthorizationRequirement';

export class NameAuthorizationRequirement
  extends AuthorizationHandler<NameAuthorizationRequirement>
  implements IAuthorizationRequirement
{
  public HandleRequirement(
    context: AuthorizationHandlerContext,
    requirement: NameAuthorizationRequirement
  ): void {
    throw new Error('Method not implemented.');
  }
}
