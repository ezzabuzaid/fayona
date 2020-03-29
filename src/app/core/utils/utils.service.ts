import { randomBytes } from 'crypto';

export type Type<T> = new (...args: any[]) => T;
// export type Type<T> = new (...args: any) => T;

export type Parameter<T extends (args: any) => any> = T extends (args: infer P) => any ? P : never;

export class AppUtils {

    static isTruthy(value: any) {
        return !!value;
    }

    static equals<T>(...values: T[]) {
        return values.every((value, i, arr) => JSON.stringify(value) === JSON.stringify(arr[0]));
    }

    static notEquals<T>(...values: T[]) {
        return !this.equals(...values);
    }

    public static notNullOrUndefined(value: any) {
        return AppUtils.isFalsy(AppUtils.isNullOrUndefined(value));
    }

    public static inverse(value: boolean) {
        return !value;
    }

    /**
     * remove null and undefined properties from an object expect empty string
     * @param withEmptyString to indicate of the empty values should be removed
     */
    static excludeEmptyKeys(object: object, withEmptyString = false) {
        const replaceUndefinedOrNull = (key: string, value: any) => {
            if (withEmptyString) {
                return this.isEmptyString(value) || this.isNullOrUndefined(value)
                    ? undefined
                    : value;
            } else {
                return this.isNullOrUndefined(value) ? undefined : value;
            }
        };
        return JSON.parse(JSON.stringify(object, replaceUndefinedOrNull));
    }

    public static isEmptyString(value: string): boolean {
        return typeof value !== 'string' || value === '';
    }

    public static isFunction(value: any) {
        return value instanceof Function;
    }

    public static isFalsy(value: any) {
        return !!!value;
    }

    public static not(value: any) {
        return !value;
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

    public static strictAssign<T>(thisType: ThisType<T>, payload: Partial<T>) {
        for (const key in thisType) {
            if (thisType.hasOwnProperty(key)) {
                thisType[key] = payload[key];
            }
        }
    }

    public static defineProperty(prototype: object, propertyKey: string, options: PropertyDescriptor) {
        return Object.defineProperty(prototype, propertyKey, {
            enumerable: false, // cannot show in keys and for in
            configurable: false // the settings cannot be changed anymore
            , ...options
        });
    }

    public static isPromise(value: any) {
        return Boolean(value && typeof value.then === 'function');
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

    public static pickProperties(obj, keys) {
        return { ...{ ...keys.map((k) => k in obj ? { [k]: obj[k] } : {}) } };
    }

    public static omitProperties(obj, keys) {
        return Object.assign({}, ...Object.keys(obj).filter((k) => !keys.includes(k)).map((k) => ({ [k]: obj[k] })));
    }

    public static isNullOrUndefined(value: any) {
        return value === undefined || value === null;
    }

    /**
     *
     * @param object check if the list has at least an item
     */
    public static hasItemWithin(object: any) {
        if (Array.isArray(object)) {
            return AppUtils.isTruthy(object.length);
        }

        if (new Object(object) === object) {
            return AppUtils.isTruthy(Object.keys(object).length);
        }

        return AppUtils.isFalsy(AppUtils.isEmptyString(object));
    }

    /**
     * check if the givin value is empty
     * supported values are string, array, pojo {}
     */
    static isEmpty(value: any) {
        return AppUtils.isFalsy(AppUtils.hasItemWithin(value));
    }

    public static extendObject<T>(target: T, source1: Partial<T>): T {
        return Object.assign(target, source1);
    }

    public static getProps<T>(target: T, ...keys: Array<keyof T>): Partial<T> {
        return keys.reduce((acc, key) => {
            acc[key] = target[key];
            return acc;
        }, {} as any);
    }

    public static generateAlphabeticString(stringLength = 5) {
        let randomString = '';
        let randomAscii: number;
        const asciiLow = 65;
        const asciiHigh = 90;
        for (let i = 0; i < stringLength; i++) {
            randomAscii = Math.floor((Math.random() * (asciiHigh - asciiLow)) + asciiLow);
            randomString += String.fromCharCode(randomAscii);
        }
        return randomString;
    }

    public static generateRandomString(): any {
        return Math.random().toString(36).substr(5, 5);
    }

    public static flatArray(data: any[]) {
        return data.reduce((a, b) => a.concat(b), []);
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

export function cast<T>(arg: any) {
    return arg as T;
}
