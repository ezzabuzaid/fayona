import { Action, IsNullOrUndefined } from '@fayona/utils';
import { InjectionToken, ServiceLifetime } from 'tiny-injector';

import { IDENTITY_SERVICE_COLLECTION } from '../IdentityServiceCollection';
import { Claim } from './Claim';
import { ClaimsIdentity } from './ClaimsIdentity';

export class ClaimsPrincipal {
  #Identities: ClaimsIdentity[] = [];

  public get Identities(): readonly ClaimsIdentity[] {
    return this.#Identities;
  }

  public get Identity(): ClaimsIdentity | undefined {
    return this.#Identities.find((identity) => identity !== null);
  }

  public *Claims(): Generator<Claim> {
    for (const identity of this.#Identities) {
      for (const claim of identity.Claims) {
        yield claim;
      }
    }
  }

  public IsInRole(role: string): boolean {
    for (const identity of this.Identities) {
      if (!IsNullOrUndefined(identity)) {
        // FIXME: identity.RoleClaimType should be overrideen somehow in order to use firebase or any other identity service
        // Check other examples in authentication directory to know how.
        if (identity.HasClaim(identity.RoleClaimType, role)) {
          return true;
        }
      }
    }
    return false;
  }

  public HasClaim(predicate: Action<Claim, boolean>): boolean;
  public HasClaim(type: string, value?: string): boolean;
  public HasClaim(
    typeOrPredicate: string | Action<Claim, boolean>,
    value?: string
  ): boolean {
    for (const identity of this.#Identities) {
      if (typeOrPredicate instanceof Function) {
        if (identity.HasClaim(typeOrPredicate)) {
          return true;
        }
      } else if (identity.HasClaim(typeOrPredicate, value)) {
        return true;
      }
    }
    return false;
  }

  public AddIdentity(identity: ClaimsIdentity): void {
    this.#Identities.push(identity);
  }

  public AddIdentities(identities: ClaimsIdentity[]): void {
    this.#Identities.push(...identities);
  }
}

export const SecureUserToken = new InjectionToken<
  Promise<ClaimsPrincipal> | ClaimsPrincipal
>('SecureUserToken', {
  lifetime: ServiceLifetime.Scoped,
  implementationFactory: (): never => {
    throw new Error('SecureUser is not defined');
  },
  provideIn: IDENTITY_SERVICE_COLLECTION,
});
