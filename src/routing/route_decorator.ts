import { Request, Response, Router as expressRouter } from 'express';
import { HttpRemoveRouteMiddlewareMetadata, Metadata, ParameterType } from './index';
import { IRouterDecorationOption } from './methods_types';
import path = require('path');
import { isEmptyString, notEmpty, Type } from '../utils';
import { construct } from '../validation';
import { autoHandler } from './auto_handler';

/**
 * When no name is provided the name will autamatically be the name of the route,
 * which by convention is the route class name minus the "Controller" suffix.
 * ex., the Controller class name is ExampleController, so the Route name is "example".
 */
export function Route(endpoint?: string, options: IRouterDecorationOption = {}) {
    return function <T extends Type<any>>(constructor: T) {
        if (!constructor.name.endsWith('Controller')) {
            throw new Error(`${ constructor.name } is not valid name, please consider suffixing your class with Controller`);
        }

        const router = expressRouter(options);
        const normalizedEndpoint = normalizeEndpoint(constructor, endpoint);
        if (notEmpty(options.children)) {
            options.children.forEach((child) => {
                const internal = child.__router();
                router.use(internal.endpoint, internal.router);
            });
        }

        const metadata = Injector.Locate(Metadata);
        Injector.AddScoped(constructor);
        // FIXME: reorder the routes to have the path variable routes at end
        // e.g
        // 1. /:id
        // 2. /filter
        // they should be
        // 2. /:id
        // 1. /filter
        // so we avoid hitting wrong resource
        metadata.getRoutes(constructor)
            .forEach(routeMetadata => {
                const normalizedEndpoint = path.normalize(path.join('/', routeMetadata.endpoint));
                const endpointHandler = async function () {
                    const [request, response] = Array.from(arguments) as [Request, Response];
                    const controllerInstance = request.locate(constructor);
                    const parameters = [];
                    const routeParameter = metadata.getRouteParameter(routeMetadata.getHandlerName()).reverse();
                    for (const parameterMetadata of routeParameter) {
                        switch (parameterMetadata.type) {
                            case ParameterType.HEADERS:
                                const headerArgument = parameterMetadata.payload;
                                let header = null;
                                if (typeof headerArgument === 'function') {
                                    header = headerArgument(request.headers);
                                } else {
                                    header = request.header(headerArgument) ?? request.headers[headerArgument];
                                }
                                parameters[parameterMetadata.index] = header;
                                break;
                            case ParameterType.PARAMS:
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
                            case ParameterType.QUERY:
                                let query = request.query;
                                if (parameterMetadata.options?.queryPolluted) {
                                    query = merge({}, query, request['queryPolluted']);
                                }

                                if (parameterMetadata.payload) {
                                    if (typeof parameterMetadata.payload !== 'string') {
                                        throw new Error('Queryparam name must be string.');
                                    } else {
                                        parameters[parameterMetadata.index] = query[parameterMetadata.payload];
                                    }
                                } else {
                                    if (userDefinedType(parameterMetadata.expectedType)) {
                                        parameters[parameterMetadata.index] = await construct(parameterMetadata.expectedType as Type<T>, query as any)
                                    } else {
                                        parameters[parameterMetadata.index] = query;
                                    }
                                }

                                break;
                            default:
                                const incomingPayload = request[parameterMetadata.type];
                                parameters[parameterMetadata.index] =
                                    userDefinedType(parameterMetadata.expectedType)
                                        ? await construct(parameterMetadata.expectedType as Type<T>, incomingPayload)
                                        : incomingPayload;
                                break;
                        }
                    }
                    return routeMetadata.handler.apply(controllerInstance, parameters);
                }
                const routeMiddlewares = metadata.getHttpRouteMiddleware(routeMetadata.getHandlerName());
                router[routeMetadata.method](normalizedEndpoint, autoHandler(
                    ...populateRouteMiddlewares(routeMiddlewares, options.middleware),
                    ...routeMetadata.middlewares,
                    endpointHandler)
                );
            });

        return class extends constructor {
            constructor(...args) {
                super(...args);
            }
            static __router() {
                return {
                    router,
                    id: generateHash(),
                    endpoint: normalizedEndpoint
                };
            }
        };
    };
}

function normalizeEndpoint(target, endpoint?: string) {
    // TODO: add options to transform the name to either singular, plural or as is
    let mappedValue = endpoint;
    if (isEmptyString(endpoint)) {
        mappedValue = target.name
            .substring(target.name.lastIndexOf('Controller'), -target.name.length)
            .toLowerCase();
    }
    return path.normalize(path.join('/', mappedValue, '/'));
}

function populateRouteMiddlewares(routeMiddlewares: HttpRemoveRouteMiddlewareMetadata[], parentMiddlewares: any[]) {
    const clonedParentMiddlewares = parentMiddlewares?.slice(0) ?? [];
    const middlewares = routeMiddlewares.map(routeMiddleware => routeMiddleware.middleware.toString());
    const index = clonedParentMiddlewares.findIndex(parentMiddleware => middlewares.includes(parentMiddleware.toString()));
    if (index !== -1) {
        clonedParentMiddlewares.splice(index, 1);
    }
    return clonedParentMiddlewares;
}


function userDefinedType(type: any) {
    return !([String, Number, Object, Symbol, Date, Promise, Proxy].includes(type));
}