import { BaseSchema } from '@core/database';
import { SchemaOptions, model } from 'mongoose';
import { MongooseTypes, generateModelMetadataKey } from '.';
import 'reflect-metadata';
import { Type } from '@core/utils';

export function Entity(name: string, options: SchemaOptions = {}) {
    return function(constructor) {
        const metadataKey = generateModelMetadataKey(constructor);
        const fields = Reflect.getMetadata(metadataKey, constructor);
        Reflect.deleteMetadata(metadataKey, constructor);
        const schema = new BaseSchema(fields, options);

        // FIXME loadClass should be removed
        schema.loadClass(constructor);

        Reflect.defineMetadata(generateModelMetadataKey(constructor), model(name, schema), constructor);
    };
}
