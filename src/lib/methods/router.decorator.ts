import { ErrorHandling } from '@core/helpers';
import { AppUtils, Logger } from '@core/utils';
import { Router as expressRouter } from 'express';
import 'reflect-metadata';
import { IExpressInternal, IRouterDecorationOption, RouterProperties } from './method-types';

const log = new Logger('Router Decorator');
import { HTTP_VERSION_NOT_SUPPORTED } from 'http-status-codes';
import path = require('path');
import { METHOD_META } from '.';

export function Router(uri: string, options: IRouterDecorationOption = {}) {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        const { prototype } = constructor;
        const router = expressRouter(options);
        const _uri = path.normalize(path.join('/', uri, '/'));

        const instance = new constructor();
        Reflect.getMetadataKeys(constructor)
            .forEach((key: string) => {
                log.debug(key);
                if (key.startsWith(METHOD_META)) {
                    const { httpMethod, instanceMethod, config } = Reflect.getOwnMetadata(key, constructor);
                    const normalizedURI = path.normalize(path.join('/', config.uri));
                    router[httpMethod](normalizedURI, ErrorHandling.wrapRoute(...config.middlewares, function () {
                        return instanceMethod.apply(instance, arguments);
                    }));
                }
            });

        if (options.middleware && options.middleware.length) {
            router.use(`${_uri}`, ErrorHandling.wrapRoute(...options.middleware));
        }

        AppUtils.defineProperty(prototype, RouterProperties.RoutesPath, { get() { return _uri; } });
        const id = AppUtils.generateHash();
        AppUtils.defineProperty(prototype, RouterProperties.ID, { get() { return id; } });
        return class extends constructor implements IExpressInternal {
            constructor(...args) {
                super(...args);
                return this;
            }
            public __router() {
                return { router, id, uri: _uri };
            }
        };
    };
}
