import { InjectionToken, ServiceLifetime } from "tiny-injector";
import { requestId } from "./RequestId";

export const REQUEST_ID = new InjectionToken<string | undefined>('REQUEST_ID', {
    lifetime: ServiceLifetime.Scoped,
    implementationFactory: () => requestId()
});
