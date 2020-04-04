import { AppUtils, Type } from '@core/utils';
import 'reflect-metadata';
import { MongooseTypes, generateModelMetadataKey } from '.';

export function Field(options: MongooseTypes.FieldOptions = {}) {
    return (instance, propertyKey: string) => {
        const constructor = instance.constructor;
        const metadataKey = generateModelMetadataKey(constructor);

        let fields = Reflect.getMetadata(metadataKey, constructor);
        if (AppUtils.isFalsy(fields)) {
            Reflect.defineMetadata(metadataKey, {}, constructor);
            fields = Reflect.getMetadata(metadataKey, constructor);
        }

        const propertyType = Reflect.getMetadata('design:type', instance, propertyKey);
        let defaults: typeof options = {};
        if (!options['pure'] && propertyType.name === String.name) {
            defaults = {
                lowercase: true,
                trim: true,
                // TODO: mark all fields as required unless explicty sitted as false
                required: true
            };
        }
        fields[propertyKey] = {
            type: propertyType.name,
            default: instance[propertyKey] || null,
            ...defaults,
            ...options,

        };
    };
}
