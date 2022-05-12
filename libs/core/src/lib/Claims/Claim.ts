import { IsNullOrEmpty } from '../Utils/Utils';
import { ClaimsIdentity } from './ClaimsIdentity';

// https://github.com/dotnet/runtime/blob/main/src/libraries/System.Security.Claims/src/System/Security/Claims/ClaimsIdentity.cs
export class Claim {
  constructor(
    public readonly Type: string,
    public readonly Value: string,
    public readonly ValueType?: string,
    public readonly Issuer?: string,
    public readonly OriginalIssuer?: string,
    public readonly Subject?: ClaimsIdentity
  ) {
    if (IsNullOrEmpty(this.OriginalIssuer)) {
      this.OriginalIssuer = this.Issuer;
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public toString(): string {
    return this.Type + ': ' + this.Value;
  }

  public Clone(): Claim;
  public Clone(other?: Claim, subject?: ClaimsIdentity): Claim {
    if (!other) {
      return new Claim(
        this.Type,
        this.Value,
        this.ValueType,
        this.Issuer,
        this.OriginalIssuer,
        this.Subject
      );
    }
    return new Claim(
      other.Type,
      other.Value,
      other.ValueType,
      other.Issuer,
      other.OriginalIssuer,
      subject
    );
  }
}
