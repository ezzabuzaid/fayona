import "reflect-metadata";
import { AppUtils } from '@core/utils';
import { MongooseTypes } from './types';


export function Field<T = any>(options: Exclude<MongooseTypes.FieldOptions, 'type'> = {}) {
    return (instance: MongooseTypes.FieldAttr & T, propertyKey: string) => {
        if (instance && !instance.fields) {
            AppUtils.defineProperty(instance, 'fields', { value: {} })
        }
        const fields = instance.fields;
        const propertyType = Reflect.getMetadata("design:type", instance, propertyKey);
        let defaults: typeof options = {};
        if (propertyType.name === String.name) {
            defaults = {
                lowercase: true,
                trim: true,
                required: propertyType.required || true
            }
        }
        fields[propertyKey] = {
            type: propertyType.name,
            ...defaults,
            ...options
        }
    }
}
