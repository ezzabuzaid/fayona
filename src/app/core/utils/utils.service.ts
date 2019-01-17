import setPrototypeOf = require('setprototypeof');
import { randomBytes } from 'crypto';

class AppUtils {
    static setPrototypeOf(constructor: object, superConstructor: object) {
        setPrototypeOf(constructor, superConstructor);
    }

    static getPrototypeOf(constructor: object) {
        return Object.getPrototypeOf(constructor);
    }

    static cloneObject(obj) {
        var clone = {};
        for (var i in obj) {
            if (obj[i] != null && typeof (obj[i]) == "object") clone[i] = this.cloneObject(obj[i]);
            else clone[i] = obj[i];
        }
        return clone;
    }

    static defineProperty(prototype: object, propertyKey: string, options: PropertyDescriptor) {
        Object.defineProperty(prototype, propertyKey, {
            enumerable: false, // cannot show in keys and for in
            configurable: false // the settings cannot be changed anymore
            , ...options
        });
    }

    static joinPath(...path) {
        const connectedPath = path.join('/');
        const cleanedPath = connectedPath.split('/').filter(path => !!path);
        cleanedPath.unshift(null);
        return cleanedPath.join('/');
    }

    static generateHash() {
        return randomBytes(20).toString('hex');
    }

    static getter(object) {
        return Object.keys(object).filter(el => typeof object[el].get === 'function');
    }

    static setter(object) {
        return Object.keys(object).filter(el => typeof object[el].set === 'function');
    }

    static methods(object) {
        return Object.keys(object).filter(el => typeof object[el].value === 'function');
    }

    // For schema decorator
    static Schema(name) {
        return function <T extends new (...args: any[]) => any>(constructor: T) {
            return class { }
        }
    }

    static removeKey(key, obj) {
        const { [key]: foo, ...rest } = obj;
        return rest;
    }
}

//* Utility class to be extended, so when you call build it will construct an instance from that class
class Singelton {
    private static instance = null;
    static build() {
        return this.instance || (this.instance = new this());
    }
}

export { Singelton, AppUtils }