import { ArgumentNullException, IsNullOrEmpty } from '@fayona/core';

/**
 * Check if the user carry the intened roles
 *
 * Authorize("HRManager") only HRManager users are authorized to continue
 *
 * Authorize("HRManager", "Finance") only HRManager or Finance users are authorized to continue
 *
 * [Authorize("HRManager"), Authorize("Finance")] only users of both HRManager and Finance roles are authorized to continue
 *
 * Will throw Forbidden response in case of authenticated user but not authorized
 */
export abstract class IAuthorizeData {
  /**
   * Do not use
   */
  public Claim?: string;

  public Roles?: string[] | string = [];
  public AuthenticationSchemes?: string | string[];
  public Policy?: string;
}
