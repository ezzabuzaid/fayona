import { Router as expressRouter } from 'express';
import { RouterDecorationOption } from '../typing';
import { AppUtils, Logger } from '@core/utils';
import { ErrorHandling } from '@core/helpers';
const log = new Logger('Router Decorator');

export function Router(routerPath: string, options: RouterDecorationOption = {}) {
    return function <T extends new (...args: any[]) => any>(constructor: T) {

        // NOTE  a way to fix path to router slashes
        routerPath = AppUtils.joinPath(routerPath);
        const { prototype } = constructor;
        const router = expressRouter(options);
        // NOTE  extend router        
        const routerPrototype = AppUtils.getPrototypeOf(router);
        for (const i in routerPrototype) {
            prototype[i] = routerPrototype[i].bind(router);
        }

        if (options.middleware && options.middleware.length) {
            router.use(ErrorHandling.wrapRoute(...options.middleware));
        }

        //* define getter for router instance
        //* this will be used in other decorators 
        // AppUtils.defineProperty(prototype, 'router', { get() { return router }, })

        //* the controller router | base path for router class
        //* all routes will be under this path
        AppUtils.defineProperty(prototype, 'routesPath', { get() { return routerPath } });

        //* mark a class with id
        const id = AppUtils.generateHash();
        AppUtils.defineProperty(prototype, 'id', { get() { return id } })


        //* construct the Router class
        //! #issue {one}, the developer must have the ability to construct their own objects
        // const routerClassinstance = new constructor;
        // AppUtils.defineProperty(prototype, 'instance', { get() { return routerClassinstance }, })
        //* Check if intercept listener defined
        //! If you try to inject the method it runtime
        //! this check will be passed, so it will be like any regular method 
        // const { instance } = routerClassinstance;
        // const { intercept } = instance;
        // if (!!intercept) {
        //     //? fine a way to bind intercept method without init an instance of Router class 
        //     router.all(`${routerPath}*`, ...(options.middleware || []), intercept.bind(instance));
        // }
        // //* retrun the created instance mean it will not be able to create another one
        // ! #issue {two} because of the #issue {one} we return the instance and the result will be as discused there
        // return instance;
        // constructor.prototype = ;
        return class extends constructor {
            constructor(...args) {
                super(...args);
                return router;
            }
        }
    }
}
