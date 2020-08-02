import { wrapRoutes } from '@core/helpers/route';
import { AppUtils } from '@core/utils';
import { locate } from '@lib/locator';
import { _validate } from '@lib/validation';
import { Router as expressRouter, Request, Response } from 'express';
import { Metadata, ParameterType } from './index';
import { IRouterDecorationOption } from './methods.types';
import path = require('path');

/**
 * When no name is provided the name will autamatically be the name of the route,
 * which by convention is the route class name minus the "Route" suffix.
 * ex., the Route class name is ExampleRoute, so the Route name is "example".
 * @param path
 */
export function Route(endpoint?: string, options: IRouterDecorationOption = {}) {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        const router = expressRouter(options);
        const instance = new constructor();

        if (AppUtils.hasItemWithin(options.children)) {
            options.children.forEach((child) => {
                const internal = child.__router();
                router.use(internal.endpoint, internal.router);
            });
        }

        const metadata = locate(Metadata);
        metadata.getRoutes(constructor)
            .forEach(routeMetadata => {
                const normalizedEndpoint = path.normalize(path.join('/', routeMetadata.endpoint));
                routeMetadata.middlewares.push(async function() {
                    const [request, response] = Array.from(arguments) as [Request, Response];
                    const parameters = [];
                    const routeParameter = metadata.getRouteParameter(routeMetadata.getHandlerName()).reverse();
                    for (const parameterMetadata of routeParameter) {
                        switch (parameterMetadata.type) {
                            case ParameterType.HEADERS:
                                const [header] = Object.values(parameterMetadata.payload);
                                parameters[parameterMetadata.index] = request.header(header) ?? request.headers[header];
                                // TODO: check if it passed as single header or dictionary
                                break;
                            case ParameterType.PARAMS:
                                const [param] = Object.values(parameterMetadata.payload);
                                parameters[parameterMetadata.index] = request.params[param];
                                break;
                            case ParameterType.RESPONSE:
                                parameters[parameterMetadata.index] = response;
                                break;
                            case ParameterType.REQUEST:
                                parameters[parameterMetadata.index] = request;
                                break;
                            default:
                                const payloadType = request[parameterMetadata.type];
                                parameters[parameterMetadata.index] =
                                    parameterMetadata.payload
                                        ? await _validate(parameterMetadata.payload, payloadType)
                                        : payloadType;
                                break;
                        }
                    }
                    return routeMetadata.handler.apply(instance, parameters);
                });
                router[routeMetadata.method](normalizedEndpoint, wrapRoutes(
                    ...(options.middleware ?? [])
                    ,
                    ...routeMetadata.middlewares
                ));
            });

        // if (AppUtils.hasItemWithin(options.middleware)) {
        //     router.use(wrapRoutes(...options.middleware));
        // }

        return class extends constructor {
            constructor(...args) {
                super(...args);
            }
            static __router() {
                return {
                    router,
                    id: AppUtils.generateHash(),
                    endpoint: normalizeEndpoint(constructor, endpoint)
                };
            }
        };
    };
}

function normalizeEndpoint(target, endpoint?: string) {
    let mappedValue = endpoint;
    if (AppUtils.isEmptyString(endpoint)) {
        mappedValue = target.name.substring(target.name.lastIndexOf(Route.name), -target.name.length);
    }
    return path.normalize(path.join('/', mappedValue, '/'));
}
