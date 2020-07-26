import { wrapRoutes } from '@core/helpers/route';
import { AppUtils } from '@core/utils';
import { locate } from '@lib/locator';
import { _validate } from '@lib/validation';
import { Router as expressRouter } from 'express';
import { Metadata } from './index';
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
        metadata.getRoutes(constructor.name)
            .forEach(routeMetadata => {
                const normalizedEndpoint = path.normalize(path.join('/', routeMetadata.endpoint));
                routeMetadata.middlewares.push(function () {
                    const originalArugments = Array.from(arguments);
                    const parameterizedArguments = metadata.getRouteParameter(routeMetadata.getHandlerName())
                        .reduce((accumlator, parameterMetadata) => {
                            const parameter = originalArugments[0][parameterMetadata.type];
                            accumlator[parameterMetadata.index] = _validate(parameterMetadata.payload, parameter);
                            return accumlator;
                        }, []);
                    return routeMetadata.handler.apply(instance, parameterizedArguments);
                });
                router[routeMetadata.method](normalizedEndpoint, wrapRoutes(...routeMetadata.middlewares));
            });
        metadata.removeRoutes(constructor.name);

        if (AppUtils.hasItemWithin(options.middleware)) {
            router.use(wrapRoutes(...options.middleware));
        }

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
