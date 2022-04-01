export * from './Environment';
export * from './RequestId/';
export * from './Response';
export * from './Routing';
export * from './validation';
export * from './WebApplication';

import { Context, ServiceType } from "tiny-injector";

declare global {
    namespace Express {

        interface Request {
            __InjectionContext: Context;
            inject<T>(serviceType: ServiceType<T>): T
        }
    }
}
