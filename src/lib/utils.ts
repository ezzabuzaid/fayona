
export type Type<T> = new (...args: any[]) => T;
export type Parameter<T extends (args: any) => any> = T extends (args: infer P) => any ? P : never;

export function isNullOrUndefined(value: any) {
    return value === undefined || value === null;
}

export function notNullOrUndefined(value: any) {
    return !isNullOrUndefined(value);
}
export function notEmpty(object: any) {
    if (Array.isArray(object)) {
        return !!object.length;
    }

    if (new Object(object) === object) {
        return !!Object.keys(object).length;
    }
    if (typeof object === 'string') {
        return !!object;
    }
    return false;
}
export function getPrototypeChain(constructor: Type<any>) {
    const chains = [];
    for (
        let prototype = constructor.prototype;
        prototype !== Object.prototype;
        prototype = Object.getPrototypeOf(prototype)
    ) {
        chains.push(prototype.constructor.name);
    }
    return chains;
}
