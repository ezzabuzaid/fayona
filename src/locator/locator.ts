import { isNullOrUndefined, Type } from '../utils';

class Registry<T> {
    constructor(public type: 'factory' | 'singelton', public instance: () => T) { }
}

export class Locator {
    private static _instance: Locator;
    static instance = Locator._instance ?? (Locator._instance = new Locator());

    #registry = new Map<string, Registry<any>>();

    registerSingelton(instance: any, provide?: Type<any>) {
        const provideName = (provide ?? instance['constructor']).name;
        if (this.#registry.has(provideName)) {
            throw new Error('You cannot override registered types');
        }
        this.#registry.set(provideName, new Registry('singelton', () => instance));
        return this;
    }

    registerFactory<T>(TypeOrProvide: Type<T>, factory?: () => T) {
        const existedRegistry = this.#registry.get(TypeOrProvide.name);
        if (existedRegistry) {
            throw new Error(`${ TypeOrProvide.name } is already registered as ${ existedRegistry.type }`);
        }
        this.#registry.set(TypeOrProvide.name, new Registry('factory', factory ?? (() => new TypeOrProvide())));
        return this;
    }

    locate<T>(type: Type<T>): T {
        const registry = this.#registry.get(type.name);
        if (isNullOrUndefined(registry)) {
            throw new Error(`${ type.name } is not registered in the locator`);
        }
        if (registry.type === 'factory') {
            return registry.instance();
        }
        return registry.instance();
    }

}

export function registerSingelton(instance: any, provide?: Type<any>) {
    Locator.instance.registerSingelton(instance, provide);
}

export function registerFactory(TypeOrProvide: Type<any>, factory?: () => any) {
    Locator.instance.registerFactory(TypeOrProvide, factory);
}

/**
 * Use it to locate an instance that is already registerd in service locator
 * 
 * Short for Locator.instance.locate(type);
 */
export function locate<T>(type: Type<T>): T {
    return Locator.instance.locate(type);
}

/**
 * A class level decorator used to register the class in service locator as singelton
 */
export function Singelton() {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        registerSingelton(new constructor());
    };
}

/**
 * A class level decorator used to register the class in service locator as factory
 * 
 * Each time the class is issued a new instance will be made
 */
export function Factory() {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        registerFactory(constructor);
    };
}

