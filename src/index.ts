export * from './Environment';
export * from './RequestId/';
export * from './Response';
export * from './Routing';
export * from './validation';
export * from './WebApplication';

import { ServiceType } from "tiny-injector";

declare global {
    namespace Express {

        interface Request {
            inject<T>(serviceType: ServiceType<T>): T
        }
    }
}
