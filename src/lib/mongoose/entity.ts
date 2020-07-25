import { BaseSchema } from '@core/database';
import { locate, Locator } from '@lib/locator';
import { Document as MongooseDocument, model, Model, SchemaOptions } from 'mongoose';
import 'reflect-metadata';
import { generateModelMetadataKey } from '.';
import { Type } from '@lib/utils';

export function Entity(name?: string, options: SchemaOptions = {}) {
    return function (constructor) {
        const metadataKey = generateModelMetadataKey(constructor);
        const fields = Reflect.getMetadata(metadataKey, constructor);
        Reflect.deleteMetadata(metadataKey, constructor);
        const schema = new BaseSchema(fields, options);
        constructor.SCHEMA_NAME = name || constructor.name;
        const modelInstance = model(constructor.SCHEMA_NAME, new BaseSchema(fields, options));
        Reflect.defineMetadata(metadataKey, modelInstance, constructor);
        Locator.instance.registerSingelton(modelInstance, constructor);
    };
}

export function locateModel<T>(modelType: Type<T>) {
    return locate<Model<T & MongooseDocument>>(modelType as any);
}
