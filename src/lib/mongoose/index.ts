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
export type WithID<T> = { id?: Types.ObjectId } & T;
export type WithMongoID<T> = { _id: Types.ObjectId } & T;

export type Payload<T> = OmitProperties<T, (...args: any) => any>;
// export type Payload<T> = CastObjectIDToString<OmitProperties<T, (...args: any) => any>>;

export function generateModelMetadataKey(target: any) {
    return `model:${target.name}`;
}

export type Projection<T> = Partial<{ [key in keyof Payload<T>]: 1 | 0 }>;
export type ColumnSort<T> = { [ket in keyof T]: 'asc' | 'desc' | 'ascending' | 'descending' };
export type PrimaryKey = Types.ObjectId;
export type ForeignKey = Types.ObjectId;
