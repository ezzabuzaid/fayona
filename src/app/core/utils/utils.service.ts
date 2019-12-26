import { randomBytes } from 'crypto';

export type Type<T> = new (...args: any) => T;

export type Parameter<T extends (args: any) => any> = T extends (args: infer P) => any ? P : never;

export class AppUtils {
    public static not(value: any) {
        return !!!value;
    }

    public static setPrototypeOf(constructor: object, superConstructor: object) {
        Object.setPrototypeOf(constructor, superConstructor);
    }

    public static getPrototypeOf<T>(constructor): Type<T> {
        return Object.getPrototypeOf(constructor);
    }

    public static getTypeOf<T>(constructor): Type<T> {
        return this.getPrototypeOf<T>(constructor).constructor as any;
    }

    public static cloneObject(obj) {
        const clone = {};
        for (const i in obj) {
            if (obj[i] !== null && typeof (obj[i]) === 'object') {
                clone[i] = this.cloneObject(obj[i]);
            } else { clone[i] = obj[i]; }
        }
        return clone;
    }

    public static defineProperty(prototype: object, propertyKey: string, options: PropertyDescriptor) {
        return Object.defineProperty(prototype, propertyKey, {
            enumerable: false, // cannot show in keys and for in
            configurable: false // the settings cannot be changed anymore
            , ...options
        });
    }

    public static joinPath(...path) {
        const connectedPath = path.join('/');
        const cleanedPath = connectedPath.split('/').filter((_path) => !!_path);
        cleanedPath.unshift(null);
        return cleanedPath.join('/');
    }

    public static generateHash() {
        return randomBytes(20).toString('hex');
    }

    public static getter(object) {
        return Object.keys(object).filter((el) => typeof object[el].get === 'function');
    }

    public static setter(object) {
        return Object.keys(object).filter((el) => typeof object[el].set === 'function');
    }

    public static methods(object) {
        return Object.keys(object).filter((el) => typeof object[el].value === 'function');
    }

    public static removeKey<T>(key: keyof T, obj: T) {
        const { [key]: foo, ...rest } = obj;
        return rest;
    }

    public static pick(obj, keys) {
        return { ...{ ...keys.map((k) => k in obj ? { [k]: obj[k] } : {}) } };
    }

    public static reject(obj, keys) {
        return Object.assign({}, ...Object.keys(obj).filter((k) => !keys.includes(k)).map((k) => ({ [k]: obj[k] })));
    }

    public static isNullOrUndefined(value: any) {
        return value === undefined || value === null;
    }

    public static hasItemWithin(list: any[]) {
        return list.length > 0;
    }

    public static assignObject<T>(target, source1: T, source2?: Partial<T>): T {
        return Object.assign(target, source1, source2);
    }

    public static getProps<T>(target: T, ...keys: Array<keyof T>): Partial<T> {
        return keys.reduce((acc, key) => {
            acc[key] = target[key];
            return acc;
        }, {} as any);
    }

}

// NOTE  Utility class to be extended, so when you call build it will construct an instance from that class
export class Singelton {
    private static instance = null;
    public static build() {
        return this.instance || (this.instance = new this());
    }
}

export type OmitProperties<T, P> = Pick<T, { [key in keyof T]: T[key] extends P ? never : key }[keyof T]>;
export type PickAttr<T, K extends keyof T> = T[K];
export type ThenArg<T> = T extends Promise<infer U> ? U : T;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
