import { Document as MongooseDocument, Model } from 'mongoose';
import 'reflect-metadata';
import { generateModelMetadataKey } from '.';
import { Type, AppUtils } from '@core/utils';
import assert from 'assert';
export function BaseModel<T>(schema: Type<T>) {
    const metadataKey = generateModelMetadataKey(schema);
    const model = Reflect.getMetadata(metadataKey, schema) as Model<T & MongooseDocument>;
    Reflect.deleteMetadata(metadataKey, schema);
    assert(AppUtils.notNullOrUndefined(model), 'Please prvoide a class decorated with @Entity');
    return model;
}

export type Document<T> = MongooseDocument & T;

export type FilterModel<Base, Condition = Model<Base & MongooseDocument>> = {
    [Key in keyof Base]:
    Base[Key] extends Condition ? Key : never
};
