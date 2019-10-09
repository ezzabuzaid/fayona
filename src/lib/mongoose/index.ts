export * from './model';
export * from './field';
export * from './entity';

import { Schema, SchemaType, SchemaTypeOpts } from 'mongoose';

export namespace MongooseTypes {

    export type FieldOptions = SchemaTypeOpts<any> | Schema | SchemaType & {
        pure?: boolean
    };
    export interface IFieldAttr {
        fields: { [keys: string]: FieldOptions };
    }

}

export type OmitProperties<T, P> = Pick<T, { [K in keyof T]: T[K] extends P ? never : K }[keyof T]>;
export type Body<T> = OmitProperties<T, (...args: any) => any>;
