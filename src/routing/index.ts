
import { Injector } from '@lib/dependency-injection';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import { ErrorResponse, HttpResponse } from 'response';
import { autoHandler } from './auto_handler';
import { Registry } from './registry';
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



export interface IEndpointOptions {
    /**
     * a string that will be used before each endpoint
     */
    prefix?: string;
}

export class Restful {
    private static created = false;
    protected application = express();
    #registry = Injector.Locate(Registry);

    private controllersAdded = false;
    private endpointAdded = false;

    constructor() {
        if (Restful.created) {
            throw new Error('Restful can be only created once');
        } else {
            Restful.created = true;
        }
    }

    /**
     * Used to register controllers
     * 
     * It could be only called one time otherwise an exception will be thrown.
     */
    UseControllers(action: (Registry: Registry) => void) {
        if (this.controllersAdded) {
            throw new Error();
        } else {
            action(this.#registry);
            this.controllersAdded = true;
        }
    }

    /**
     * Resolve controller endpoint
     * 
     * must be called once and after `UseControllers`
     */
    UseEndpoints(action?: (options: IEndpointOptions) => void) {
        if (!this.controllersAdded || this.endpointAdded) {
            throw new Error();
        } else {
            this.endpointAdded = true;
            const options: IEndpointOptions = {};
            action?.call(null, options);
            this.#registry.routers.forEach(({ router, endpoint }) => {
                this.application.use(path.join(path.normalize(options.prefix ?? '/'), endpoint), router);
            });
            this.application.use(autoHandler((req) => {
                throw new ErrorResponse(`${ req.originalUrl } => ${ 'endpoint_not_found' }`, StatusCodes.NOT_FOUND);
            }));
        }
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
            if (res.headersSent) {
                return next(error);
            }
            const response = action(error);
            res.status(response.statusCode).json(response.toJson());
        });
    }


    public get<T>(key: string): T {
        return this.application.get(key);
    }

    public set(key: string, value: any) {
        this.application.set(key, value);
    }

    get expressApplication() {
        return this.application;
    }
}

export function isEnv(name: 'development' | 'production') {
    return process.env.NODE_ENV === name;
}