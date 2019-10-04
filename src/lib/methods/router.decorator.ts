import { ErrorHandling } from '@core/helpers';
import { AppUtils, Logger } from '@core/utils';
import { Router as expressRouter } from 'express';
import 'reflect-metadata';
import { IExpressInternal, IRouterDecorationOption, RouterProperties } from './methods.types';

const log = new Logger('Router Decorator');
import path = require('path');
import { METHOD_META } from '.';
const routes = {};
export function Router(baseUri: string, options: IRouterDecorationOption = {}) {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        log.info(constructor.name);
        const { prototype } = constructor;
        const router = expressRouter(options);
        const routerUri = path.normalize(path.join('/', baseUri, '/'));
        const instance = new constructor();
        Reflect.getMetadataKeys(constructor)
            .forEach((key: string) => {
                if (key.startsWith(METHOD_META)) {
                    log.debug(key);
                    routes[routerUri] = constructor;
                    const metadata = Reflect.getMetadata(key, constructor);
                    if (metadata) {
                        const { httpMethod, method, middlewares, uri } = metadata;
                        const normalizedURI = path.normalize(path.join('/', uri));
                        router[httpMethod](normalizedURI, ErrorHandling.wrapRoutes(...middlewares, function() {
                            return method.apply(instance, arguments);
                        }));

                    }
                }
            });

        // console.log(routes);
        if (options.middleware && options.middleware.length) {
            router.use(`${routerUri}`, ErrorHandling.wrapRoutes(...options.middleware));
        }

        AppUtils.defineProperty(prototype, RouterProperties.RoutesPath, { get() { return routerUri; } });
        const id = AppUtils.generateHash();
        AppUtils.defineProperty(prototype, RouterProperties.ID, { get() { return id; } });
        return class extends constructor implements IExpressInternal {
            constructor(...args) {
                super(...args);
                return this;
            }
            public __router() {
                return { router, id, uri: routerUri };
            }
        };
    };
}
