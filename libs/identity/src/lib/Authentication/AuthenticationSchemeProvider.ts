import { IAuthenticationOptions } from './AuthenticationOptions';
import { AuthenticationScheme } from './AuthenticationScheme';

export class AuthenticationSchemeProvider {
  constructor(private readonly AuthenticationOptions: IAuthenticationOptions) {}

  public GetScheme(name?: string): AuthenticationScheme | undefined {
    return name ? this.AuthenticationOptions.SchemasMap.get(name) : undefined;
  }

  public GetDefaultScheme(): AuthenticationScheme | undefined {
    return this.GetScheme(this.AuthenticationOptions.DefaultScheme);
  }

  public GetDefaultAuthenticateScheme(): AuthenticationScheme | undefined {
    return (
      this.GetScheme(this.AuthenticationOptions.DefaultAuthenticateScheme) ??
      this.GetScheme(this.AuthenticationOptions.DefaultScheme)
    );
  }
}
