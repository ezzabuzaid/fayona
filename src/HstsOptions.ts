// https://www.stackhawk.com/blog/node-js-http-strict-transport-security-guide-what-it-is-and-how-to-enable-it/
// https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-6.0&tabs=visual-studio&viewFallbackFrom=aspnetcore-2.1#http-strict-transport-security-protocol-hsts
export abstract class HstsOptions {
    abstract Preload: boolean;
    abstract IncludeSubDomains: boolean;
    abstract MaxAge: number;
    // 2592000 = 30 day
    abstract ExcludedHosts: string[];
}
