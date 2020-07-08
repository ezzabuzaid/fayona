import { Type, AppUtils } from '@core/utils';

export class Locator {
    private static _instance: Locator;
    static instance = Locator._instance ?? (Locator._instance = new Locator());
    registry = new WeakMap();
    registerSingelton(TypeOrProvide: Type<any>, provide?: object) {
        this.registry.set(provide ?? TypeOrProvide, () => TypeOrProvide);
        return this;
    }
    registerFactory(TypeOrProvide: Type<any>, factory?: (init) => Type<any>) {
        this.registry.set(TypeOrProvide, factory);
        return this;
    }

    locate<T>(type: Type<T>): T {
        const entry = this.registry.get(type);
        if (AppUtils.isNullOrUndefined(entry)) {
            throw new Error(`${ type.name } is not registered in the locator`);
        }
        return entry();
    }

}

export function Singelton() {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        Locator.instance.registerSingelton(new constructor());
    };
}

export function locate<T>(type: Type<T>): T {
    return Locator.instance.locate(type);
}
