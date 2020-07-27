import { RequestHandler } from 'express';
import 'reflect-metadata';
import { Locator } from '@lib/locator';
import { Type } from '@lib/utils';

export * from './get.decorator';
export * from './put.decorator';
export * from './delete.decorator';
export * from './patch.decorator';
export * from './router.decorator';
export * from './intercept.decorator';
export * from './post.decorator';
export * from './body.decorator';
export * from './query.decorator';
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
        public handler: () => void,
        public endpoint: string,
        public method: METHODS,
        public controllerName: string,
        public middlewares: RequestHandler[]
    ) { }

    getHandlerName() {
        return this.controllerName + this.handler.name;
    }
}

export enum ParameterType {
    BODY = 'body',
    HEADERS = 'headers',
    QUERY = 'query',
    RESPONSE = 'response'
}

export class Metadata {
    #parameters: ParameterMetadata[] = [];
    #routes: HttpRouteMetadata[] = [];
    registerParameter(parameterMetadata: ParameterMetadata) {
        this.#parameters.push(parameterMetadata)
    }

    registerHttpRoute(httpRouteMetadata: HttpRouteMetadata) {
        this.#routes.push(httpRouteMetadata)
    }

    getRoutes(controllerName: string) {
        return this.#routes.filter((item) => item.controllerName === controllerName);
    }

    getRouteParameter(handlerName: string) {
        return this.#parameters.filter((item) => item.getHandlerName() === handlerName);
    }

    removeParameters(handlerName: string) {
        this.#parameters = this.#parameters.filter((item) => item.getHandlerName() !== handlerName);
    }

    removeRoutes(controllerName: string) {
        this.#routes = this.#routes.filter((route) => {
            if (route.controllerName !== controllerName) {
                return true;
            }
            this.removeParameters(route.getHandlerName());
            return false;
        });
    }

}
Locator.instance.registerSingelton(new Metadata());

export function registerParameter(parameterMetadata: ParameterMetadata) {
    let metadata = Locator.instance.locate(Metadata);
    metadata.registerParameter(parameterMetadata);
}

export function registerHttpRoute(httpRouteMetadata: HttpRouteMetadata) {
    let metadata = Locator.instance.locate(Metadata);
    metadata.registerHttpRoute(httpRouteMetadata);
}