import { RequestHandler } from 'express';
import 'reflect-metadata';
import { Locator } from '@lib/locator';
import { Type, getPrototypeChain, isNullOrUndefined, notNullOrUndefined, notEmpty } from '@lib/utils';

export * from './get.decorator';
export * from './put.decorator';
export * from './delete.decorator';
export * from './patch.decorator';
export * from './router.decorator';
export * from './intercept.decorator';
export * from './post.decorator';
export * from './body.decorator';
export * from './query.decorator';
export * from './params.decorator';
export * from './response.decorator';
export * from './methods.types';

export enum METHODS {
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete',
    GET = 'get',
    POST = 'post'
}

export interface IMetadataDto {
    uri: string;
    middlewares: RequestHandler[];
    method: METHODS;
    target: {
        constructor: any,
        [key: string]: any
    };
    propertyKey: string;
}

export interface IMetadata {
    uri: string;
    middlewares: RequestHandler[];
    method: METHODS;
    handler: (...args) => any;
}

export const method_metadata_key = 'METHOD';

export function generateMetadataKey(method: METHODS, uri: string) {
    return `${ method_metadata_key }:${ method }:${ uri }`;
}

export function define({ method, uri, middlewares, target, propertyKey }: IMetadataDto) {
    const meta: IMetadata = {
        uri,
        middlewares: middlewares ?? [],
        method,
        handler: target[propertyKey],
    };
    Reflect.defineMetadata(generateMetadataKey(method, uri), meta, target.constructor);
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

export class HttpRouteMetadata {
    constructor(
        public controller: Type<any>,
        public handler: () => void,
        public endpoint: string,
        public method: METHODS,
        public middlewares: RequestHandler[]
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
    PARAMS = 'params'
}

export class Metadata {
    #parameters: ParameterMetadata[] = [];

    private metadataKey(httpRouteMetadata: HttpRouteMetadata) {
        return `${ httpRouteMetadata.method }:${ httpRouteMetadata.endpoint }`;
    }
    registerParameter(parameterMetadata: ParameterMetadata) {
        this.#parameters.push(parameterMetadata);
    }

    registerHttpRoute(httpRouteMetadata: HttpRouteMetadata) {
        Reflect.defineMetadata(this.metadataKey(httpRouteMetadata), httpRouteMetadata, httpRouteMetadata.controller);
    }

    getRoutes(constructor) {
        return Reflect.getMetadataKeys(constructor)
            .map((key, index, arr) => {
                const metadata = Reflect.getMetadata(key, constructor);
                return metadata;
            }).filter(notEmpty) as HttpRouteMetadata[];
    }

    getRouteParameter(handlerName: string) {
        return this.#parameters.filter((item) => item.getHandlerName() === handlerName);
    }

    removeParameters(handlerName: string) {
        this.#parameters = this.#parameters.filter((item) => item.getHandlerName() !== handlerName);
    }

}
Locator.instance.registerSingelton(new Metadata());

export function registerParameter(parameterMetadata: ParameterMetadata) {
    const metadata = Locator.instance.locate(Metadata);
    metadata.registerParameter(parameterMetadata);
}

export function registerHttpRoute(httpRouteMetadata: HttpRouteMetadata) {
    const metadata = Locator.instance.locate(Metadata);
    metadata.registerHttpRoute(httpRouteMetadata);
}
