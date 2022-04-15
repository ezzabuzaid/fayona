// export class ClaimsPrincipal {
// 	private Identities: ClaimsIdentity[] = [];
// 	IsInRole(role: string): boolean {
// 		return false
// 	}

import { InjectionToken, ServiceLifetime } from 'tiny-injector';
import { RoutingCollection } from '../../utils/Collections';
import { ROLE_CLAIM_TYPE } from './RoleClaimType';
import { Action, IsNullOrUndefined } from './Utils';

// 	HasClaim(type: string, value: string): boolean {
// 		return this.Identities.some(it => it.HasClaim(type, value))
// 	}

// 	FindFirst(type: string) { }
// 	FindAll(type: string) { }

// 	AddIdentities(identities: ClaimsIdentity[]): void { }
// 	AddIdentity(identity: ClaimsIdentity): void { }
// }

// class ClaimsIdentity {
// 	private Claims: Claim[] = [];
// 	HasClaim(type: string, value: string): boolean {
// 		return !!this.Claims.find((it) => it.Type === type) ?? false;
// 	}
// }

class Claim {
  constructor(public type: string, public value: string) {}
}

export class ClaimsPrincipal {
  #Claims: Claim[] = [];
  #Roles: string[] = [];

  public IsInRole(roleOrRoles: string | string[]): boolean {
    const roleClaims = this.#Claims.filter((it) => it.type === ROLE_CLAIM_TYPE);
    const roles = roleClaims.map((it) => it.value);
    if (Array.isArray(roleOrRoles)) {
      return roles.some((it) => roleOrRoles.includes(it));
    }
    return roles.includes(roleOrRoles);
  }

  public AddClaim(claim: Claim): void {
    this.#Claims.push(claim);
  }

  public Print(): void {
    console.log({
      Roles: this.#Roles,
      Claims: this.#Claims,
    });
  }

  public HasClaim(predicate: Action<Claim, boolean>): boolean;
  public HasClaim(type: string, values?: string[] | null): boolean;
  public HasClaim(
    type: string | Action<Claim, boolean>,
    values?: string[] | null
  ): boolean {
    // if value is not null then check if the claim has it
    // if value is null then only check if claim type exist
    if (type instanceof Function) {
      return this.#Claims.some(type);
    }
    return this.#Claims.some((it) => {
      return (
        it.type === type &&
        (IsNullOrUndefined(values) ? true : values.includes(it.value))
      );
    });
  }
}
export const SecureUserToken = new InjectionToken<
  Promise<ClaimsPrincipal> | ClaimsPrincipal
>('SecureUserToken', {
  lifetime: ServiceLifetime.Scoped,
  implementationFactory: () => {
    throw new Error('SecureUser is not defined');
  },
  provideIn: RoutingCollection,
});
