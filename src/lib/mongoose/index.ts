export * from './model';
export * from './field';
export * from './entity';

import { Schema, SchemaType, SchemaTypeOpts, Types } from 'mongoose';
import { OmitProperties } from '@core/utils';

export namespace MongooseTypes {

    export type FieldOptions = SchemaTypeOpts<any> | Schema | SchemaType & {
        pure?: boolean
    };
    export interface IFieldAttr {
        fields: { [keys: string]: FieldOptions };
    }

}

export type CastObjectIDToString<T> = { [key in keyof T]: T[key] extends Types.ObjectId ? string : T[key] };
export type WithID<T> = { id?: string } & T;
export type WithMongoID<T> = { _id: string } & T;

// TODO: rename it Payload
export type Body<T> = CastObjectIDToString<OmitProperties<T, (...args: any) => any>>;

export function generateModelMetadataKey(target: any) {
    return `model:${target.name}`;
}
