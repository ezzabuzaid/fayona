import setPrototypeOf = require('setprototypeof');
import { randomBytes } from 'crypto';
import axios from 'axios';

export interface Type<T> extends Function {
    new(...args: any): T;
}

export type Parameter<T extends (args: any) => any> = T extends (args: infer P) => any ? P : never;

export class AppUtils {
    static setPrototypeOf(constructor: object, superConstructor: object) {
        const fn = Object.setPrototypeOf || setPrototypeOf;
        fn(constructor, superConstructor);
    }

    static getPrototypeOf<T>(constructor): Type<T> {
        return Object.getPrototypeOf(constructor);
    }

    static getTypeOf<T>(constructor): Type<T> {
        return this.getPrototypeOf<T>(constructor).constructor as any;
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
        return Object.defineProperty(prototype, propertyKey, {
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
    
    static removeKey(key, obj) {
        const { [key]: foo, ...rest } = obj;
        return rest;
    }

    static pick(obj, keys) {
        return { ...{ ...keys.map(k => k in obj ? { [k]: obj[k] } : {}) } }
    }

    static reject(obj, keys) {
        return Object.assign({}, ...Object.keys(obj).filter(k => !keys.includes(k)).map(k => ({ [k]: obj[k] })))
    }

    static async getHtml(uri) {
        const { data } = await axios.get(uri);
        return data;
    }
}

// NOTE  Utility class to be extended, so when you call build it will construct an instance from that class
export class Singelton {
    private static instance = null;
    static build() {
        return this.instance || (this.instance = new this());
    }
}
