import { RequestHandler } from "express";
import { AuthorizationPolicyBuilder } from "Identity/Authorize/AuthorizationPolicyBuilder";
import { Injectable, ServiceLifetime } from "tiny-injector";
import { Logger } from "tslog";
import { generateAlphabeticString, notEmpty, Type } from "../utils";
import { HttpEndpointMetadata } from "./HttpEndpointMetadata";
import { HttpEndpointMiddlewareMetadata } from "./HttpEndpointMiddlewareMetadata";
import { HttpRouteMetadata } from "./HttpRouteMetadata";
import { ParameterMetadata } from "./ParameterMetadata";
import { makeHandlerName } from "./Utils";

const logger = new Logger({ name: 'Routing', minLevel: 'error' });

@Injectable({ lifetime: ServiceLifetime.Singleton })
export class Metadata {
    #endpointToPolicy: Record<string, AuthorizationPolicyBuilder[]> = {};
    #routes: HttpRouteMetadata[] = [];
    #parameters = new Map<string, ParameterMetadata[]>();
    #middlewares = new Map<string, HttpEndpointMiddlewareMetadata[]>();
    #endpoints: HttpEndpointMetadata[] = [];
    static MetadataKey = generateAlphabeticString();
    private metadataKey(methodName: string, endpoint: string | RegExp) {
        return `${Metadata.MetadataKey}:${methodName}:${endpoint}`;
    }

    registerHttpEndpointMiddleware(httpEndpointMiddlewareMetadata: HttpEndpointMiddlewareMetadata) {
        logger.debug('Registering Endpoint Middleware', httpEndpointMiddlewareMetadata.getHandlerName());
        const middlewares = this.#middlewares.get(httpEndpointMiddlewareMetadata.getHandlerName()) ?? [];
        middlewares.push(httpEndpointMiddlewareMetadata);
        this.#middlewares.set(httpEndpointMiddlewareMetadata.getHandlerName(), middlewares);
    }

    RegisterHttpEndpointMiddlewareV2(httpEndpointMetadata: HttpEndpointMetadata, ...middlewares: RequestHandler[]) {
        httpEndpointMetadata.middlewares.push(...middlewares)
    }

    registerParameter(parameterMetadata: ParameterMetadata) {
        logger.debug('Registering Parameter for ', parameterMetadata.getHandlerName(), ' at index ', parameterMetadata.index);
        const parameters = this.#parameters.get(parameterMetadata.getHandlerName()) ?? [];
        parameters.push(parameterMetadata);
        this.#parameters.set(parameterMetadata.getHandlerName(), parameters);
    }

    registerHttpEndpoint(httpEndpointMetadata: HttpEndpointMetadata) {
        logger.debug('Registering Endpoint', httpEndpointMetadata.getHandlerName());
        const { endpoint, method, controller } = httpEndpointMetadata;
        const key = this.metadataKey(method, endpoint);
        Reflect.defineMetadata(key, httpEndpointMetadata, controller);
        this.#endpoints.push(httpEndpointMetadata);
    }

    registerHttpRoute(httpRouteMetadata: HttpRouteMetadata) {
        logger.debug('Registering Route', httpRouteMetadata.controller.name);
        this.#routes.push(httpRouteMetadata);
    }

    GetHttpRoutes() {
        return Array.from(this.#routes);
    }

    GetHttpEndpoint(methodName: string, endpoint: string | RegExp) {

    }

    RegisterAuthorize(controller: Function, propertyKey: string, middleware: any) {
        const key = makeHandlerName(controller, propertyKey);
        logger.debug('Registering Authorize', key);
        const middlewares = Reflect.getMetadata(key, controller) ?? [];
        middlewares.push(middleware);
        Reflect.defineMetadata(key, middlewares, controller);
    }

    RegisterPolicy(controller: Function, propertyKey: string, policy: AuthorizationPolicyBuilder) {
        const key = makeHandlerName(controller, propertyKey);
        logger.debug('Registering Policy', key);
        if (!Array.isArray(this.#endpointToPolicy[key])) {
            this.#endpointToPolicy[key] = [];
        }
        this.#endpointToPolicy[key].push(policy)
    }

    GetPolices(httpEndpointMetadata: HttpEndpointMetadata) {
        return this.#endpointToPolicy[httpEndpointMetadata.getHandlerName()];
    }

    GetAuthorizeMiddlewares(httpEndpointMetadata: HttpEndpointMetadata) {
        const key = httpEndpointMetadata.getHandlerName();
        return Reflect.getMetadata(key, httpEndpointMetadata.controller) ?? [];
    }

    GetHttpRoute(child: any) {
        return this.#routes.find(route => route.controller === child);
    }

    GetEndpoints(constructor: Type<any>) {
        return (Reflect.getMetadataKeys(constructor) as string[])
            .filter(it => it.startsWith(Metadata.MetadataKey))
            .map(it => [Reflect.getMetadata, Reflect.deleteMetadata].map(_ => _(it, constructor))[0])
            .filter(notEmpty) as HttpEndpointMetadata[];
    }

    getHttpEndpointParameters(handlerName: string) {
        return this.#parameters.get(handlerName) ?? [];
    }

    GetHttpEndpointMiddlewares(handlerName: string) {
        return this.#middlewares.get(handlerName) ?? [];
    }

}
