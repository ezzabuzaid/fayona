import { Action } from '../Utils/Action';
import { IsNullOrEmpty, IsNullOrUndefined } from '../Utils/Utils';
import { Claim } from './Claim';
import { ClaimTypes } from './ClaimType';

export class ClaimsIdentity {
  #Claims: Claim[] = [];
  public DefaultIssuer = 'LOCAL AUTHORITY';
  public DefaultNameClaimType: string = ClaimTypes.Name;
  public DefaultRoleClaimType: string = ClaimTypes.Role;
  constructor(
    public readonly AuthenticationType: string,
    public readonly NameClaimType: string,
    public readonly RoleClaimType: string
  ) {
    if (IsNullOrEmpty(this.RoleClaimType)) {
      this.RoleClaimType = this.DefaultRoleClaimType;
    }
    if (IsNullOrEmpty(this.NameClaimType)) {
      this.NameClaimType = this.DefaultNameClaimType;
    }
  }

  public get Name(): string | undefined {
    return this.#Claims.find((claim) => claim.Type === this.NameClaimType)
      ?.Value;
  }

  public get Claims(): readonly Claim[] {
    return this.#Claims;
  }

  public get IsAuthenticated(): boolean {
    return IsNullOrEmpty(this.AuthenticationType);
  }

  public AddClaim(claim: Claim): void {
    if (claim.Subject === this) {
      this.#Claims.push(claim);
    }
    {
      this.#Claims.push(claim.Clone());
    }
  }

  public AddClaims(claims: Claim[]): void {
    for (const claim of claims) {
      if (IsNullOrUndefined(claim)) {
        continue;
      }
      this.AddClaim(claim);
    }
  }

  public HasClaim(predicate: Action<Claim, boolean>): boolean;
  public HasClaim(type: string, value?: string): boolean;
  public HasClaim(
    type: string | Action<Claim, boolean>,
    value?: string
  ): boolean {
    if (type instanceof Function) {
      return this.#Claims.some(type);
    }
    for (const claim of this.Claims) {
      if (!IsNullOrUndefined(claim)) {
        if (
          claim.Type === type &&
          (!IsNullOrUndefined(value) ? claim.Value === value : true)
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
