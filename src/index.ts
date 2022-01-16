export * from './main';
export * from './Response';
export * from './Routing';
export * from './validation';
import { ServiceType } from "tiny-injector";


declare global {
    namespace Express {

        interface Request {
            locate<T>(serviceType: ServiceType<T>): T
        }
    }
}
