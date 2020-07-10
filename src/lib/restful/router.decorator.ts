import 'reflect-metadata';
import path = require('path');
import { AppUtils } from '@core/utils';
import { Router as expressRouter } from 'express';
import { IRouterDecorationOption } from './methods.types';
import { IMetadata, method_metadata_key } from './index';
import { wrapRoutes } from '@core/helpers/route';

/**
 * When no name is provided the name will autamatically be the name of the route,
 * which by convention is the route class name minus the "Route" suffix.
 * ex., the Route class name is ExampleRoute, so the Route name is "example".
 * @param path
 */
export function Route(baseUri?: string, options: IRouterDecorationOption = {}) {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        const router = expressRouter(options);
        const instance = new constructor();

        if (AppUtils.hasItemWithin(options.children)) {
            options.children.forEach((child) => {
                const internal = child.__router();
                router.use(internal.uri, internal.router);
            });
        }

        Reflect.getMetadataKeys(constructor)
            .forEach((key: string) => {
                if (key.startsWith(method_metadata_key)) {
                    const metadata = Reflect.getMetadata(key, constructor) as IMetadata;
                    Reflect.deleteMetadata(key, constructor);
                    if (metadata) {
                        const { handler, method, middlewares, uri } = metadata;
                        const normalizedURI = path.normalize(path.join('/', uri));
                        router[method](normalizedURI, wrapRoutes(...middlewares, function originalMethod() {
                            return handler.apply(instance, Array.from(arguments));
                        }));
                    }
                }
            });

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
                    uri: formatUri(constructor, baseUri)
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
