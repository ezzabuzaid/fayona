import { AppUtils } from '@core/utils';
import 'reflect-metadata';
import { MongooseTypes } from '.';

// TODO: the `type` property should be in the `options` type

export function Field<T = any>(options: MongooseTypes.FieldOptions) {
    return (instance: MongooseTypes.IFieldAttr & T, propertyKey: string) => {
        if (instance && !instance.fields) {
            AppUtils.defineProperty(instance, 'fields', { value: {} });
        }
        const fields = instance.fields;
        const propertyType = Reflect.getMetadata('design:type', instance, propertyKey);
        let defaults: typeof options = {};
        if (!!options.pure && propertyType.name === String.name) {
            defaults = {
                lowercase: true,
                trim: true,
                required: propertyType.required === false ? propertyType.required : true
            };
        }
        fields[propertyKey] = {
            type: propertyType.name,
            ...defaults,
            ...options
        };
    };
}
