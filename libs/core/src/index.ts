// export * from './lib/Metadata';
// export * from './lib/WebApplication';
export * from './lib/WebApplicationBuilder';
export * from './lib/IWebApplicationBuilder';
export * from './lib/IWebApplication';
export * from './lib/RequestId';

import { Context, ServiceType } from 'tiny-injector';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __InjectionContext: Context;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      inject<T>(serviceType: ServiceType<T>): T;
    }
  }
}
