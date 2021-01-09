
import { RequestHandler } from 'express';
import 'reflect-metadata';
import { ErrorResponse } from 'response/error_response';
import { HttpResponse } from 'response/generic_response';
import { generateAlphabeticString, notEmpty, Type } from 'utils';
import { locate, registerSingelton, Singelton } from '../locator';
import { Registry } from './registry';
import { wrapRoutes } from './wrap_route';
import express = require('express');
import path = require('path');

export * from './body_decorator';
export * from './delete_decorator';
export * from './get_decorator';
export * from './methods_types';
export * from './params_decorator';
export * from './patch_decorator';
export * from './post_decorator';
export * from './put_decorator';
export * from './query_decorator';
export * from './remove_middleware_decorator';
export * from './request_decorator';
export * from './response_decorator';
export * from './route_decorator';
export * from './wrap_route';

export enum METHODS {
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete',
    GET = 'get',
    POST = 'post'
}

export interface IMetadata {
    uri: string;
    middlewares: RequestHandler[];
    method: METHODS;
    handler: (...args: any[]) => any;
}

export class ParameterMetadata {
    constructor(
        public index: number,
        public type: ParameterType,
        public payload: any,
        private handlerName: string,
        private controllerName: string,
    ) { }

    getHandlerName() {
        return this.controllerName + this.handlerName;
    }
}

export class HttpRemoveRouteMiddlewareMetadata {
    constructor(
        public middleware: () => any,
        public controller: Type<any>,
        public handler: () => void,
    ) { }

    getHandlerName() {
        return this.controller.name + this.handler.name;
    }
}

export class HttpRouteMetadata {
    constructor(
        public controller: Function,
        public handler: () => void,
        public endpoint: string,
        public method: METHODS,
        public middlewares: RequestHandler[],
    ) { }

    getHandlerName() {
        return this.controller.name + this.handler.name;
    }
}

export enum ParameterType {
    BODY = 'body',
    HEADERS = 'headers',
    QUERY = 'query',
    RESPONSE = 'response',
    REQUEST = 'request',
    PARAMS = 'params'
}

@Singelton()
export class Metadata {
    private parameters = new Map<string, ParameterMetadata[]>();
    private middlewares = new Map<string, HttpRemoveRouteMiddlewareMetadata[]>();
    static MetadataKey = generateAlphabeticString();
    private metadataKey(httpRouteMetadata: HttpRouteMetadata) {
        return `${ Metadata.MetadataKey }:${ httpRouteMetadata.method }:${ httpRouteMetadata.endpoint }`;
    }
    registerParameter(parameterMetadata: ParameterMetadata) {
        const parameters = this.parameters.get(parameterMetadata.getHandlerName()) ?? [];
        parameters.push(parameterMetadata);
        this.parameters.set(parameterMetadata.getHandlerName(), parameters);
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
        return this.parameters.get(handlerName) ?? [];
    }

    getHttpRouteMiddleware(handlerName: string) {
        return this.middlewares.get(handlerName) ?? [];
    }

    registerHttpRouteMiddleware(httpRouteMiddlewareMetadata: HttpRemoveRouteMiddlewareMetadata) {
        const middlewares = this.middlewares.get(httpRouteMiddlewareMetadata.getHandlerName()) ?? [];
        middlewares.push(httpRouteMiddlewareMetadata);
        this.middlewares.set(httpRouteMiddlewareMetadata.getHandlerName(), middlewares);
    }

}

export function registerParameter(parameterMetadata: ParameterMetadata) {
    locate(Metadata).registerParameter(parameterMetadata);
}

export function registerHttpRoute(httpRouteMetadata: HttpRouteMetadata) {
    locate(Metadata).registerHttpRoute(httpRouteMetadata);
}

export function registerMiddleware(httpRouteMetadata: HttpRemoveRouteMiddlewareMetadata) {
    locate(Metadata).registerHttpRouteMiddleware(httpRouteMetadata);
}


export interface IEndpointOptions {
    /**
     * a string that will be used before each endpoint
     */
    prefix?: string;
}



export class Restful {
    private static created = false;
    protected application = express();
    private registry = locate(Registry);

    constructor() {
        if (Restful.created) {
            throw new Error('Restful can be only created once');
        } else {
            Restful.created = true;
            registerSingelton(this);
        }
    }

    /**
     * Used to register controllers
     * 
     * all calls after `UseEndpoints` will be ignored 
     */
    UseControllers(action: (Registry: Registry) => void) {
        action(this.registry);
    }

    /**
     * Resolve controller endpoint
     * 
     * must be called once and after `UseControllers`
     */
    UseEndpoints(action?: (options: IEndpointOptions) => void) {
        const options: IEndpointOptions = {};
        action?.call(null, options);
        this.registry.routers.forEach(({ router, endpoint }) => {
            this.application.use(path.join(path.normalize(options.prefix ?? '/'), endpoint), router);
        });
        this.application.use(wrapRoutes((req) => {
            throw new ErrorResponse(`${ req.originalUrl } => ${ 'endpoint_not_found' }`, 404);
        }));

    }


    /**
     * All uncaught errors related to express will be bubbled up to this handler.
     * 
     * It's benfical if you don't want to handle the same error again and again
     * 
     * e.g getByIdOrFail() will fail in case the item is not there hence you need to wrap it in try catch or use then().catch(),
     * thus, you need to find a way to let the error fly to this handler so you can handle it in one place
     */
    UseErrorHandler(action: (error: any) => HttpResponse) {
        this.application.use((error, req, res, next) => {
            const response = action(error);
            res.status(response.code).json(response);
        });
    }


    public get<T>(key: string): T {
        return this.application.get(key);
    }

    public set(key: string, value: any) {
        this.application.set(key, value);
    }
}
