import 'reflect-metadata';
import path = require('path');
import { AppUtils, Logger } from '@core/utils';
import { Router as expressRouter } from 'express';
import { IRouterDecorationOption } from './methods.types';
import { IMetadata, method_metadata_key } from './index';
import { wrapRoutes } from '@core/helpers/route';

export function Router(baseUri: string, options: IRouterDecorationOption = {}) {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        const log = new Logger(constructor.name);
        const router = expressRouter(options);
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
                    uri: path.normalize(path.join('/', baseUri, '/'))
                };
            }
        };
    };
}
