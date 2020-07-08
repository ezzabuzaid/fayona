import { Type } from "@core/utils";

export class Locator {
    private static _instance: Locator;
    static instance = Locator._instance ?? (Locator._instance = new Locator());
    registry = new WeakMap();
    registerSingelton(TypeOrProvide: Type<any>, provide?: object) {
        this.registry.set(provide ?? TypeOrProvide, new TypeOrProvide());
        return this;
    }
    registerFactory(TypeOrProvide: Type<any>, factory?: (init) => Type<any>) {
        this.registry.set(TypeOrProvide, factory);
        return this;
    }

    locate<T>(Type: Type<T>): T {
        const entry = this.registry.get(Type);
        if (entry instanceof Type) {
            return entry;
        } else {
            const instance = () => new Type();
            return entry(instance);
        }
    }

}

export function Singelton() {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        Locator.instance.registerSingelton(constructor);
    }
}

export function locate<T>(Type: Type<T>): T {
    return Locator.instance.locate(Type);
}