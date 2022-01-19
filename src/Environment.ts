import { Injectable, ServiceLifetime } from "tiny-injector";

@Injectable({
    lifetime: ServiceLifetime.Singleton
})
export class Environment {
    IsStaging() {
        return this.IsEnvironment('staging');
    }

    IsDevelopment() {
        return this.IsEnvironment('development') || this.IsEnvironment(undefined);
    }

    IsProduction() {
        return this.IsEnvironment('production');
    }

    IsEnvironment(name: string | undefined) {
        return this.EnvironmentName === name;
    }

    get EnvironmentName() {
        return process.env.NODE_ENV;
    }
}
