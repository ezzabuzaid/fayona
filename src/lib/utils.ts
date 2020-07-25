
export type Type<T> = new (...args: any[]) => T;
export type Parameter<T extends (args: any) => any> = T extends (args: infer P) => any ? P : never;
