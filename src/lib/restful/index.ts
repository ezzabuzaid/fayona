import { AppUtils } from '@core/utils';
import { Locator, Singelton } from '@lib/locator';
import { notEmpty, Type } from '@lib/utils';
import { RequestHandler } from 'express';
import 'reflect-metadata';

export * from './body.decorator';
export * from './delete.decorator';
export * from './get.decorator';
export * from './intercept.decorator';
export * from './methods.types';
export * from './params.decorator';
export * from './patch.decorator';
export * from './post.decorator';
export * from './put.decorator';
export * from './query.decorator';
export * from './response.decorator';
export * from './request.decorator';
export * from './router.decorator';
export * from './remove-middleware.decorator';

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
        public payload: Type<any>,
        private handlerName: string,
        private controllerName: string,
    ) { }

    getHandlerName() {
        return this.controllerName + this.handlerName;
    }
}

export class HttpRouteMiddlewareMetadata {
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
        public controller: Type<any>,
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
    #parameters = new Map<string, ParameterMetadata[]>();
    #middlewares = new Map<string, HttpRouteMiddlewareMetadata[]>();
    static MetadataKey = AppUtils.generateAlphabeticString();
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

    registerHttpRouteMiddleware(httpRouteMiddlewareMetadata: HttpRouteMiddlewareMetadata) {
        const middlewares = this.#middlewares.get(httpRouteMiddlewareMetadata.getHandlerName()) ?? [];
        middlewares.push(httpRouteMiddlewareMetadata);
        this.#middlewares.set(httpRouteMiddlewareMetadata.getHandlerName(), middlewares);
    }

}

export function registerParameter(parameterMetadata: ParameterMetadata) {
    const metadata = Locator.instance.locate(Metadata);
    metadata.registerParameter(parameterMetadata);
}

export function registerHttpRoute(httpRouteMetadata: HttpRouteMetadata) {
    const metadata = Locator.instance.locate(Metadata);
    metadata.registerHttpRoute(httpRouteMetadata);
}

export function registerMiddleware(httpRouteMetadata: HttpRouteMiddlewareMetadata) {
    const metadata = Locator.instance.locate(Metadata);
    metadata.registerHttpRouteMiddleware(httpRouteMetadata);
}
