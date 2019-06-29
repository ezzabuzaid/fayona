import { RequestHandler } from 'express';
import 'reflect-metadata';

export * from './get.decorator';
export * from './put.decorator';
export * from './delete.decorator';
export * from './patch.decorator';
export * from './router.decorator';
export * from './interceptor.decorator';
export * from './post.decorator';
export * from './method-types';

export enum METHODS {
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete',
    GET = 'get',
    POST = 'post'
}

export interface IMETA {
    method: METHODS;
    uri: string;
    middlewares: RequestHandler[];
    target: any;
    propertyKey: string;
}

export const METHOD_META = 'METHOD:';

export function define({ method, uri, middlewares, target, propertyKey }: IMETA) {
    const meta = {
        config: { middlewares, uri },
        httpMethod: method,
        instanceMethod: target[propertyKey],
    };
    // TODO Throw an error if two uri are the same
    Reflect.defineMetadata(`${METHOD_META}${method}:${uri}`, meta, target.constructor);
}
