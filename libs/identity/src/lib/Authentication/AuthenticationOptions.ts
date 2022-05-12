import { InvalidOperationException } from '@fayona/core';

import { AuthenticationScheme } from './AuthenticationScheme';

export class IAuthenticationOptions {
  public DefaultScheme?: string;
  public DefaultAuthenticateScheme?: string;
  public DefaultChallengeScheme?: string;
  public SchemasMap = new Map();
  public Schemas: AuthenticationScheme[] = [];

  public AddScheme(authenticationScheme: AuthenticationScheme): void {
    if (this.Schemas.some((item) => item)) {
      throw new InvalidOperationException(
        `${authenticationScheme} already exist.`
      );
    } else {
      this.Schemas.push(authenticationScheme);
      this.SchemasMap.set(authenticationScheme.Name, authenticationScheme);
    }
  }
}
