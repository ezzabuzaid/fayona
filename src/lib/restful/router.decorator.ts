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
                router.use(internal.uri, internal.router);
            });
        }

        const metadata = locate(Metadata);
        metadata.getRoutes(constructor)
            .forEach(routeMetadata => {
                const normalizedEndpoint = path.normalize(path.join('/', routeMetadata.endpoint));
                routeMetadata.middlewares.push(async function () {
                    const [request, response] = Array.from(arguments) as [Request, Response];
                    const parameterizedArguments = [];
                    const parameters = metadata.getRouteParameter(routeMetadata.getHandlerName());
                    for (const parameterMetadata of parameters) {
                        switch (parameterMetadata.type) {
                            case ParameterType.HEADERS:
                                const [header] = Object.values(parameterMetadata.payload);
                                parameterizedArguments[parameterMetadata.index] = request.header(header);
                                break;
                            case ParameterType.PARAMS:
                                const [param] = Object.values(parameterMetadata.payload);
                                parameterizedArguments[parameterMetadata.index] = request.params[param];
                                break;
                            case ParameterType.RESPONSE:
                                parameterizedArguments[parameterMetadata.index] = response;
                                break;
                            default:
                                const payloadType = request[parameterMetadata.type];
                                parameterizedArguments[parameterMetadata.index] =
                                    parameterMetadata.payload
                                        ? await _validate(parameterMetadata.payload, payloadType)
                                        : payloadType
                                break;
                        }
                    }
                    return routeMetadata.handler.apply(instance, parameterizedArguments);
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
                    uri: formatUri(constructor, endpoint)
                };
            }
        };
    };
}

function formatUri(target, baseUri?: string) {
    let uri = baseUri;
    if (AppUtils.isEmptyString(baseUri)) {
        uri = target.name.substring(target.name.lastIndexOf(Route.name), -target.name.length);
    }
    return path.normalize(path.join('/', uri, '/'));
}
