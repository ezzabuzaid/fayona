import { Request, RequestHandler, Response, Router as expressRouter } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import path from 'path';
import { Injector } from 'tiny-injector';
import { isEmptyString, Type } from '../../utils';
import { construct } from '../../validation';
import { autoHandler } from '../AutoHandler';
import { HttpRemoveEndpointMiddlewareMetadata } from '../HttpRemoveEndpointMiddlewareMetadata';
import { HttpRouteMetadata } from '../HttpRouteMetadata';
import { IRouterDecorationOption } from '../IRouterDecorationOption';
import { Metadata } from '../Metadata';
import { ParameterType } from '../ParameterType';
/**
 * When no name is provided the name will autamatically be the name of the route,
 * which by convention is the route class name minus the "Controller" suffix.
 * ex., the Controller class name is ExampleController, so the Route name is "example".
 */
export function Route(endpoint?: string, options: IRouterDecorationOption = {}) {
    return function (constructor: Type<any>) {
        if (!constructor.name.endsWith('Controller')) {
            throw new Error(`${ constructor.name } is not valid name, please consider suffixing your class with Controller`);
        }

        const metadata = Injector.GetRequiredService(Metadata);
        const router = expressRouter(options);
        const normalizedEndpoint = normalizeEndpoint(constructor, endpoint ?? '/');

        if (Array.isArray(options.children) && options.children.length > 0) {
            options.children.forEach((childController) => {
                const childRoute = metadata.getHttpRoute(childController);
                if (childRoute) {
                    router.use(childRoute.endpoint, childRoute.router);
                } else {
                    throw new Error(`Cannot find @Route for ${ childController.name }`);
                }
            });
        }

        metadata.registerHttpRoute(new HttpRouteMetadata(
            constructor,
            router,
            normalizedEndpoint
        ))
        Injector.AddScoped(constructor as any);

        // FIXME: reorder the routes to have the path variable routes at end
        // e.g
        // 1. /:id
        // 2. /filter
        // they should be
        // 2. /:id
        // 1. /filter
        // so we avoid hitting wrong resource
        metadata.getEndpoints(constructor)
            .forEach(routeMetadata => {
                const normalizedEndpoint = routeMetadata.endpoint instanceof RegExp ? routeMetadata.endpoint : path.normalize(path.join('/', routeMetadata.endpoint));
                const endpointHandler = async function () {
                    const [request, response] = Array.from(arguments) as [Request, Response];
                    const controllerInstance = request.locate(constructor);
                    const parameters = [];
                    const endpointParameters = metadata.getHttpEndpointParameters(routeMetadata.getHandlerName()).reverse();
                    for (const parameterMetadata of endpointParameters) {
                        switch (parameterMetadata.type) {
                            case ParameterType.FROM_HEADER:
                                const headerArgument = parameterMetadata.payload;
                                let header = null;
                                if (typeof headerArgument === 'function') {
                                    header = headerArgument(request.headers);
                                } else {
                                    header = request.header(headerArgument) ?? request.headers[headerArgument];
                                }
                                parameters[parameterMetadata.index] = header;
                                break;
                            case ParameterType.FROM_ROUTE:
                                const param = parameterMetadata.payload;
                                if (isEmptyString(param)) {
                                    throw new Error('param must be a string');
                                }
                                parameters[parameterMetadata.index] = request.params[param];
                                break;
                            case ParameterType.RESPONSE:
                                parameters[parameterMetadata.index] = response;
                                break;
                            case ParameterType.REQUEST:
                                if (parameterMetadata.payload) {
                                    parameters[parameterMetadata.index] = parameterMetadata.payload(request);
                                } else {
                                    parameters[parameterMetadata.index] = request;
                                }
                                break;
                            case ParameterType.FROM_QUERY:
                                let query = request.query;
                                // FIXME: to be removed
                                // it should be abstraction so the user can hook it with his logic
                                // maybe provide action function as hook that returns a Record<string, any>
                                if (parameterMetadata.options?.queryPolluted) {
                                    // query = merge({}, query, request['queryPolluted']);
                                }

                                if (parameterMetadata.payload) {
                                    if (typeof parameterMetadata.payload !== 'string') {
                                        throw new Error('Queryparam name must be string.');
                                    } else {
                                        parameters[parameterMetadata.index] = query[parameterMetadata.payload];
                                    }
                                } else {
                                    if (userDefinedType(parameterMetadata.expectedType)) {
                                        parameters[parameterMetadata.index] = await construct(parameterMetadata.expectedType as Type<any>, query as any)
                                    } else {
                                        parameters[parameterMetadata.index] = query;
                                    }
                                }

                                break;
                            case ParameterType.FROM_SERVICES:
                                parameters[parameterMetadata.index] = request.locate(parameterMetadata.expectedType);
                                break;
                            default:
                                const incomingPayload = request[parameterMetadata.type];
                                parameters[parameterMetadata.index] =
                                    userDefinedType(parameterMetadata.expectedType)
                                        ? await construct(parameterMetadata.expectedType as Type<any>, incomingPayload)
                                        : incomingPayload;
                                break;
                        }
                    }
                    return routeMetadata.handler.apply(controllerInstance, parameters as []);
                }
                const routeMiddlewares = metadata.getHttpEndpointMiddlewares(routeMetadata.getHandlerName());
                router[routeMetadata.method](normalizedEndpoint, autoHandler(
                    ...populateRouteMiddlewares(routeMiddlewares, options.middleware),
                    ...routeMetadata.middlewares,
                    endpointHandler
                ));
            });

        return constructor;
    };
}

function normalizeEndpoint(target: Record<string, any>, endpoint: string) {
    // TODO: add options to transform the name to either singular, plural or as is
    let mappedValue = endpoint;
    if (isEmptyString(endpoint)) {
        mappedValue = target.name
            .substring(target.name.lastIndexOf('Controller'), -target.name.length)
            .toLowerCase();
    }
    return path.normalize(path.join('/', mappedValue, '/'));
}

function populateRouteMiddlewares(listRemoveEndpointMiddlewareMetadata: HttpRemoveEndpointMiddlewareMetadata[], parentMiddlewares?: RequestHandler[] | RequestHandlerParams[]) {
    const clonedParentMiddlewares = parentMiddlewares?.slice(0) ?? [];
    const middlewares = listRemoveEndpointMiddlewareMetadata.map(endpointMiddleware => endpointMiddleware.middleware.toString());
    const index = clonedParentMiddlewares.findIndex(parentMiddleware => middlewares.includes(parentMiddleware.toString()));
    if (index !== -1) {
        clonedParentMiddlewares.splice(index, 1);
    }
    return clonedParentMiddlewares;
}


function userDefinedType(type: any) {
    return !([String, Number, Object, Symbol, Date, Promise, Proxy].includes(type));
}
