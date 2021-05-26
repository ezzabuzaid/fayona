import { generateAlphabeticString, notEmpty } from "../utils";
import { ParameterMetadata } from "./parameter_metadata";
import { HttpRemoveRouteMiddlewareMetadata } from "./remove_route_middleware_metadata";
import { HttpRouteMetadata } from "./route_metadata";

@Injectable({ lifetime: ServiceLifetime.Singleton })
export class Metadata {
    #parameters = new Map<string, ParameterMetadata[]>();
    #middlewares = new Map<string, HttpRemoveRouteMiddlewareMetadata[]>();
    static MetadataKey = generateAlphabeticString();
    private metadataKey(httpRouteMetadata: HttpRouteMetadata) {
        return `${ Metadata.MetadataKey }:${ httpRouteMetadata.method }:${ httpRouteMetadata.endpoint }`;
    }
    registerParameter(parameterMetadata: ParameterMetadata) {
        const parameters = this.#parameters.get(parameterMetadata.getHandlerName()) ?? [];
        parameters.push(parameterMetadata);
        this.#parameters.set(parameterMetadata.getHandlerName(), parameters);
    }

    registerHttpRoute(httpRouteMetadata: HttpRouteMetadata) {
        Reflect.defineMetadata(this.metadataKey(httpRouteMetadata), httpRouteMetadata, httpRouteMetadata.controller);
    }

    getRoutes(constructor) {
        return (Reflect.getMetadataKeys(constructor) as string[])
            .filter(it => it.startsWith(Metadata.MetadataKey))
            .map(it => [Reflect.getMetadata, Reflect.deleteMetadata].map(_ => _(it, constructor))[0])
            .filter(notEmpty) as HttpRouteMetadata[];
    }

    getRouteParameter(handlerName: string) {
        return this.#parameters.get(handlerName) ?? [];
    }

    getHttpRouteMiddleware(handlerName: string) {
        return this.#middlewares.get(handlerName) ?? [];
    }

    registerHttpRouteMiddleware(httpRouteMiddlewareMetadata: HttpRemoveRouteMiddlewareMetadata) {
        const middlewares = this.#middlewares.get(httpRouteMiddlewareMetadata.getHandlerName()) ?? [];
        middlewares.push(httpRouteMiddlewareMetadata);
        this.#middlewares.set(httpRouteMiddlewareMetadata.getHandlerName(), middlewares);
    }

}



// FIXME: to be removed
// Use Injector.Locate(Metadata);
export function registerParameter(parameterMetadata: ParameterMetadata) {
    Injector.Locate(Metadata).registerParameter(parameterMetadata);
}

// FIXME: to be removed
// Use Injector.Locate(Metadata);
export function registerHttpRoute(httpRouteMetadata: HttpRouteMetadata) {
    Injector.Locate(Metadata).registerHttpRoute(httpRouteMetadata);
}

// FIXME: to be removed
// Use Injector.Locate(Metadata);
export function registerMiddleware(httpRouteMetadata: HttpRemoveRouteMiddlewareMetadata) {
    Injector.Locate(Metadata).registerHttpRouteMiddleware(httpRouteMetadata);
}
