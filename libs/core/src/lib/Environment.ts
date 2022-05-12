import { Injectable, ServiceLifetime } from 'tiny-injector';

@Injectable({
  lifetime: ServiceLifetime.Singleton,
})
export class Environment {
  public IsStaging(): boolean {
    return this.IsEnvironment('staging');
  }

  public IsDevelopment(): boolean {
    return this.IsEnvironment('development') || this.IsEnvironment(undefined);
  }

  public IsProduction(): boolean {
    return this.IsEnvironment('production');
  }

  public IsEnvironment(name: string | undefined): boolean {
    return this.EnvironmentName === name;
  }

  public get EnvironmentName(): string | undefined {
    return process.env['NODE_ENV'];
  }
}
