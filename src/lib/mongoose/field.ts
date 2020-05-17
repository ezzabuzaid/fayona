import { AppUtils } from '@core/utils';
import 'reflect-metadata';
import { MongooseTypes, generateModelMetadataKey } from '.';
import { model } from 'mongoose';

export function Field(options: Partial<MongooseTypes.FieldOptions> = {}) {
    return (instance, propertyKey: string) => {
        const constructor = instance.constructor;
        const metadataKey = generateModelMetadataKey(constructor);

        let fields = Reflect.getMetadata(metadataKey, constructor);
        if (AppUtils.isNullOrUndefined(fields)) {
            Reflect.defineMetadata(metadataKey, {}, constructor);
            fields = Reflect.getMetadata(metadataKey, constructor);
        }

        const propertyType = Reflect.getMetadata('design:type', instance, propertyKey);

        let defaults: Partial<typeof options> = {};
        if (!options['pure'] && propertyType.name === String.name) {
            defaults = {
                lowercase: true,
                trim: true,
                required: true
            };
        }
        fields[propertyKey] = {
            ...defaults,
            ...options,
            type: options['subdocument'] ? model(options['type'].SCHEMA_NAME).schema : propertyType.name,
        };

    };
}
