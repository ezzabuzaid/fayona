import { BaseSchema } from '@core/database';
import { SchemaOptions, model } from 'mongoose';
import { generateModelMetadataKey } from '.';
import 'reflect-metadata';

export function Entity(name?: string, options: SchemaOptions = {}) {
    return function(constructor) {
        const metadataKey = generateModelMetadataKey(constructor);
        const fields = Reflect.getMetadata(metadataKey, constructor);
        Reflect.deleteMetadata(metadataKey, constructor);
        const schema = new BaseSchema(fields, options);
        constructor.SCHEMA_NAME = name || constructor.name;
        Reflect.defineMetadata(generateModelMetadataKey(constructor), model(
            constructor.SCHEMA_NAME,
            schema
        ), constructor);
    };
}
