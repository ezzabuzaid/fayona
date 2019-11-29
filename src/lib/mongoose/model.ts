import { Document, Model } from 'mongoose';
import 'reflect-metadata';
import { generateModelMetadataKey } from '.';

export function BaseModel<T>(schema: any) {
    const model = Reflect.getMetadata(generateModelMetadataKey(schema), schema) as Model<T & Document>;
    Reflect.deleteMetadata(generateModelMetadataKey(schema), schema);
    if (model) {
        return model;
    }
    throw new Error('Please prvoide a class decorated with @Entity');
}

export type FilterModel<Base, Condition = Model<Base & Document>> = {
    [Key in keyof Base]:
    Base[Key] extends Condition ? Key : never
};

export type Document<T> = Document & T;
