import { BaseSchema } from '@core/database';
import { SchemaOptions, model } from 'mongoose';
import { generateModelMetadataKey } from '.';
import 'reflect-metadata';

export function Entity(name: string, options: SchemaOptions = {}) {
    return function(constructor) {
        const metadataKey = generateModelMetadataKey(constructor);
        const fields = Reflect.getMetadata(metadataKey, constructor);
        Reflect.deleteMetadata(metadataKey, constructor);
        const schema = new BaseSchema(fields, options);
        Reflect.defineMetadata(generateModelMetadataKey(constructor), model(name, schema), constructor);
    };
}
