import { ErrorHandling } from '@core/helpers';
import { RouterMethodDecorator } from './method-types';

export function Intercept() {
    return function(target: RouterMethodDecorator, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;
        descriptor.value = function() {
            // * any code here will be executed when the marked method get called
            return method.apply(target, arguments);
        };

        // NOTE  since the method decorator called before the class decorator we have no access to any of
        // the method or properites that binded manually by the {Router} decorator
        // and setTimeout solved the problem
        setTimeout(() => {
            // * assign the router
            target.use(ErrorHandling.wrapRoute(function() {
                console.log('Test interceptor');
                return target[propertyKey](...arguments);
            }));

        }, 0);
    };
}

// * use observer pattren here
// * in wrapper class if any registred route has a intercept method
// as an instance method it will subscribe into the observer
// * this way rise the ability o life cycle of parent intercept,

// !! BETTER
// ** alias
// * use @Intercept dec to register the method to intercept the request
// hince the @Router dec mark the class as router instance
// therefore you can have all the router method inside the dec factory
