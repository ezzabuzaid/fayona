
export type Type<T> = new (...args: any[]) => T;
export type Parameter<T extends (args: any) => any> = T extends (args: infer P) => any ? P : never;

export function isNullOrUndefined(value: any) {
    return value === undefined || value === null;
}

export function getPrototypeChain(constructor: Type<any>) {
    const chains = [];
    for (let prototype = constructor.prototype; prototype != Object.prototype; prototype = Object.getPrototypeOf(prototype)) {
        chains.push(prototype.constructor.name)
    }
    return chains;
}