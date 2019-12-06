import { BaseSchema } from '@core/database';
import { SchemaOptions, model } from 'mongoose';
import { MongooseTypes, generateModelMetadataKey } from '.';
import 'reflect-metadata';

export function Entity(
    name: string,
    options: SchemaOptions = {},
    globalFieldOptions: Exclude<MongooseTypes.FieldOptions, 'type'> = {}
) {
    return function(constructor: new (...args: any) => any) {
        // TODO: use metadata instead of binding the fields to the prototype
        const fields = constructor.prototype.fields;
        Object.keys(fields).forEach((key) => {
            fields[key] = { ...fields[key], ...globalFieldOptions };
        });
        const schema = new BaseSchema(fields, options);
        schema.loadClass(constructor);
        Reflect.defineMetadata(generateModelMetadataKey(constructor), model(name, schema), constructor);
        // return class extends constructor {
        //     constructor(...args) {
        //         super(...args);
        //         return this;
        //     }
        // };
    };
}

// export function Virtual(name: string) {
//     return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
//         const originalMethod = descriptor.value;
//         descriptor.value = function (...args: any[]) {
//             const result = originalMethod.apply(this, args);
//             console.log(result);
//         };
//     };
// }
