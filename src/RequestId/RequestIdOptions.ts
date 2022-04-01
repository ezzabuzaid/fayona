import { nanoid } from "nanoid";
import { Injectable, ServiceLifetime } from "tiny-injector";
import { RoutingCollection } from "../utils/Collections";

@Injectable({
    lifetime: ServiceLifetime.Singleton,
    provideIn: RoutingCollection
})
export class RequestIdOptions {
    setHeader = false;
    headerName = 'X-Request-Id';
    generator = () => nanoid()
}
