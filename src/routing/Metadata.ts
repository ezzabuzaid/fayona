import { Injectable, ServiceLifetime } from "tiny-injector";
import { Logger } from "tslog";
import { generateAlphabeticString, notEmpty, Type } from "../utils";
import { HttpEndpointMetadata } from "./HttpEndpointMetadata";
import { HttpRemoveEndpointMiddlewareMetadata } from "./HttpRemoveEndpointMiddlewareMetadata";
import { HttpRouteMetadata } from "./HttpRouteMetadata";
import { ParameterMetadata } from "./ParameterMetadata";

const logger = new Logger({ name: 'Routing' });

@Injectable({ lifetime: ServiceLifetime.Singleton })
export class Metadata {
    #routes: HttpRouteMetadata[] = [];
    #parameters = new Map<string, ParameterMetadata[]>();
    #middlewares = new Map<string, HttpRemoveEndpointMiddlewareMetadata[]>();
    static MetadataKey = generateAlphabeticString();
    private metadataKey(httpEndpointMetadata: HttpEndpointMetadata) {
        return `${ Metadata.MetadataKey }:${ httpEndpointMetadata.method }:${ httpEndpointMetadata.endpoint }`;
    }

    registerHttpEndpointMiddleware(httpRemoveEndpointMiddlewareMetadata: HttpRemoveEndpointMiddlewareMetadata) {
        logger.debug('Registering Endpoint Middleware', httpRemoveEndpointMiddlewareMetadata.getHandlerName());
        const middlewares = this.#middlewares.get(httpRemoveEndpointMiddlewareMetadata.getHandlerName()) ?? [];
        middlewares.push(httpRemoveEndpointMiddlewareMetadata);
        this.#middlewares.set(httpRemoveEndpointMiddlewareMetadata.getHandlerName(), middlewares);
    }

    registerParameter(parameterMetadata: ParameterMetadata) {
        logger.debug('Registering Parameter for ', parameterMetadata.getHandlerName(), ' at index ', parameterMetadata.index);
        const parameters = this.#parameters.get(parameterMetadata.getHandlerName()) ?? [];
        parameters.push(parameterMetadata);
        this.#parameters.set(parameterMetadata.getHandlerName(), parameters);
    }

    registerHttpEndpoint(httpEndpointMetadata: HttpEndpointMetadata) {
        logger.debug('Registering Endpoint', httpEndpointMetadata.getHandlerName());
        Reflect.defineMetadata(this.metadataKey(httpEndpointMetadata), httpEndpointMetadata, httpEndpointMetadata.controller);
    }

    registerHttpRoute(httpRouteMetadata: HttpRouteMetadata) {
        logger.debug('Registering Route', httpRouteMetadata.controller.name);
        this.#routes.push(httpRouteMetadata);
    }

    getHttpRoutes() {
        return Array.from(this.#routes);
    }

    getHttpRoute(child: any) {
        return this.#routes.find(route => route.controller === child);
    }

    getEndpoints(constructor: Type<any>) {
        return (Reflect.getMetadataKeys(constructor) as string[])
            .filter(it => it.startsWith(Metadata.MetadataKey))
            .map(it => [Reflect.getMetadata, Reflect.deleteMetadata].map(_ => _(it, constructor))[0])
            .filter(notEmpty) as HttpEndpointMetadata[];
    }

    getHttpEndpointParameters(handlerName: string) {
        return this.#parameters.get(handlerName) ?? [];
    }

    getHttpEndpointMiddlewares(handlerName: string) {
        return this.#middlewares.get(handlerName) ?? [];
    }

}
