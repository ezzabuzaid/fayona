import { Document as MongooseDocument, Model } from 'mongoose';
import 'reflect-metadata';
import { generateModelMetadataKey } from '.';

export function BaseModel<T>(schema: any) {
    const model = Reflect.getMetadata(generateModelMetadataKey(schema), schema) as Model<T & MongooseDocument>;
    Reflect.deleteMetadata(generateModelMetadataKey(schema), schema);
    if (model) {
        return model;
    }
    throw new Error('Please prvoide a class decorated with @Entity');
}

export type Document<T> = MongooseDocument & T;

export type FilterModel<Base, Condition = Model<Base & MongooseDocument>> = {
    [Key in keyof Base]:
    Base[Key] extends Condition ? Key : never
};
