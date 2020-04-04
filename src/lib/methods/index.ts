import { RequestHandler } from 'express';
import 'reflect-metadata';

export * from './get.decorator';
export * from './put.decorator';
export * from './delete.decorator';
export * from './patch.decorator';
export * from './router.decorator';
export * from './intercept.decorator';
export * from './post.decorator';
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
    return `${method_metadata_key}:${method}:${uri}`;
}

export function define({ method, uri, middlewares, target, propertyKey }: IMetadataDto) {
    const meta: IMetadata = {
        uri,
        middlewares: middlewares || [],
        method,
        handler: target[propertyKey],
    };
    Reflect.defineMetadata(generateMetadataKey(method, uri), meta, target.constructor);
}
