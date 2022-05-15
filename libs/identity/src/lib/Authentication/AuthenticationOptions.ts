import {
  ArgumentNullException,
  InvalidOperationException,
  IsNullOrUndefined,
} from '@fayona/core';

import { AuthenticationScheme } from './AuthenticationScheme';

export class IAuthenticationOptions {
  public DefaultScheme?: string;
  public DefaultAuthenticateScheme?: string;
  public DefaultChallengeScheme?: string;
  public SchemasMap = new Map();
  public Schemas: AuthenticationScheme[] = [];

  public AddScheme(authenticationScheme: AuthenticationScheme): void {
    if (this.SchemasMap.has(authenticationScheme.Name)) {
      throw new InvalidOperationException(
        'Scheme already exists: ' + authenticationScheme.Name
      );
    }
    if (IsNullOrUndefined(authenticationScheme.Name)) {
      throw new ArgumentNullException(
        'Cannot be null',
        'authenticationScheme.Name'
      );
    }
    this.Schemas.push(authenticationScheme);
    this.SchemasMap.set(authenticationScheme.Name, authenticationScheme);
  }
}
