import { isNullOrUndefined, Type } from "../utils";
import { ServiceLocator } from "./locator";
import "reflect-metadata";

/**
 * Locate an instance that is already registerd in service locator
 *
 * Short for Locator.instance.locate(type);
 */
// @ts-ignore
export function locate<T>(type: Type<T>): T;
export function locate<T>(type: Type<T>, context: InstanceType<any>): T;
export function locate<T>(type: Type<T>, context: InstanceType<any>): T {
    return ServiceLocator.instance.locate(type, context ?? null);
}

/**
 * A class level decorator used to register the class in service locator as Singelton
 */
export function Singelton(): ClassDecorator {
    return function <T extends Type<any>>(constructor: T) {
        ServiceLocator.instance.addSingelton(constructor);
    };
}

/**
 * A class level decorator used to register the class in service locator as Transient
 * 
 * Each time the class is located a new instance will be made
 */
export function Transient(): ClassDecorator {
    return function <T extends Type<any>>(constructor: T) {
        ServiceLocator.instance.addTransient(constructor);
    };
}

export function Scoped(): ClassDecorator {
    return function <T extends Type<any>>(constructor: T) {
        ServiceLocator.instance.addScoped(constructor);
    };
}
