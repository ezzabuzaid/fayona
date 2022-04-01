import { Request, RequestHandler, Response, Router as expressRouter } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import path from 'path';
import { Injector } from 'tiny-injector';
import { AuthorizationService, SecureUserToken } from '../../Identity';
import { HttpEndpointMetadata } from '../../Routing/HttpEndpointMetadata';
import { isEmptyString, Type } from '../../utils';
import { RoutingInjector } from '../../utils/Collections';
import { construct } from '../../validation';
import { autoHandler } from '../AutoHandler';
import { HttpEndpointMiddlewareMetadata } from '../HttpEndpointMiddlewareMetadata';
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
            throw new Error(`${constructor.name} is not valid name, please consider suffixing your class with Controller`);
        }

        const metadata = Injector.GetRequiredService(Metadata);
        const router = expressRouter(options);
        const normalizedEndpoint = normalizeEndpoint(constructor, endpoint ?? '/');

        if (Array.isArray(options.children) && options.children.length > 0) {
            options.children.forEach((childController) => {
                const childRoute = metadata.GetHttpRoute(childController);
                if (childRoute) {
                    router.use(childRoute.endpoint, childRoute.router);
                } else {
                    throw new Error(`Cannot find @Route for ${childController.name}`);
                }
            });
        }

        metadata.registerHttpRoute(new HttpRouteMetadata(
            constructor,
            router,
            normalizedEndpoint
        ))
        RoutingInjector.AddScoped(constructor as any);

        // FIXME: reorder the routes to have the path variable routes at end
        // e.g
        // 1. /:id
        // 2. /filter
        // they should be
        // 2. /:id
        // 1. /filter
        // so we avoid hitting wrong resource
        metadata.GetEndpoints(constructor)
            .forEach(httpEndpointMetadata => {
                const normalizedEndpoint = httpEndpointMetadata.endpoint instanceof RegExp ? httpEndpointMetadata.endpoint : path.normalize(path.join('/', httpEndpointMetadata.endpoint));
                const endpointHandler = async function () {
                    const [request, response] = Array.from(arguments) as [Request, Response];
                    const controllerInstance = request.inject(constructor);
                    const parameters = [];
                    const endpointParameters = metadata.getHttpEndpointParameters(httpEndpointMetadata.getHandlerName()).reverse();
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
                                parameters[parameterMetadata.index] = request.inject(parameterMetadata.expectedType);
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
                    return httpEndpointMetadata.handler.apply(controllerInstance, parameters as []);
                }
                const routeMiddlewares = metadata.GetHttpEndpointMiddlewares(httpEndpointMetadata.getHandlerName());
                const authorizeMiddlewares = metadata.GetAuthorizeMiddlewares(httpEndpointMetadata);
                router[httpEndpointMetadata.method](normalizedEndpoint, autoHandler(
                    ...authorizeMiddlewares,
                    AuthorizeMiddlewares(httpEndpointMetadata),
                    // ...populateRouteMiddlewares(routeMiddlewares, options.middleware),
                    ...(options.middleware ?? []),
                    ...httpEndpointMetadata.middlewares,
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

function populateRouteMiddlewares(listRemoveEndpointMiddlewareMetadata: HttpEndpointMiddlewareMetadata[], parentMiddlewares?: RequestHandler[] | RequestHandlerParams[]) {
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

const AuthorizeMiddlewares: (httpEndpointMetadata: HttpEndpointMetadata) => RequestHandler = (httpEndpointMetadata) => async (req, res, next) => {
    const metadata = Injector.GetRequiredService(Metadata);
    const authorizationService = req.inject(AuthorizationService);
    const polices = metadata.GetPolices(httpEndpointMetadata);
    const result = authorizationService.Authorize(
        await req.inject(SecureUserToken as any),
        polices.map(it => it.Requirements).flat(),
    );
    if (result.Succeeded) {
        next();
    } else {
        console.log(result);
        next(result)
    }
}
