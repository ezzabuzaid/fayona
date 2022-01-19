import { nanoid } from "nanoid";
import { Injectable, ServiceLifetime } from "tiny-injector";

@Injectable({
    lifetime: ServiceLifetime.Singleton
})
export class RequestIdOptions {
    setHeader = false;
    headerName = 'X-Request-Id';
    generator = () => nanoid()
}
