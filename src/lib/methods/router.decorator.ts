import { AppUtils, Logger } from '@core/utils';
import { Router as expressRouter } from 'express';
import 'reflect-metadata';
import { IExpressInternal, IRouterDecorationOption, RouterProperties } from './methods.types';

const log = new Logger('Router Decorator');
import path = require('path');
import { IMetadata, method_metadata_key } from './index';
import { wrapRoutes } from '@core/helpers/route';

export function Router(baseUri: string, options: IRouterDecorationOption = {}) {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        log.info(constructor.name);
        const { prototype } = constructor;
        const router = expressRouter(options);
        const routerUri = path.normalize(path.join('/', baseUri, '/'));
        const instance = new constructor();

        Reflect.getMetadataKeys(constructor)
            .forEach((key: string) => {
                if (key.startsWith(method_metadata_key)) {
                    const metadata = Reflect.getMetadata(key, constructor) as IMetadata;
                    Reflect.deleteMetadata(key, constructor);
                    if (metadata) {
                        const { handler, method, middlewares, uri } = metadata;
                        const normalizedURI = path.normalize(path.join('/', uri));
                        router[method](normalizedURI, wrapRoutes(...middlewares, function originalMethod() {
                            return handler.apply(instance, arguments);
                        }));
                    }
                }
            });

        if (AppUtils.hasItemWithin(options.middleware)) {
            router.use(`${routerUri}`, wrapRoutes(...options.middleware));
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
                return {
                    router,
                    id,
                    uri: routerUri
                };
            }
        };
    };
}
