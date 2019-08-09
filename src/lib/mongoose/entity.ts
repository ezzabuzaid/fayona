import { BaseSchema } from '@core/database';
import { SchemaOptions } from 'mongoose';
import { MongooseTypes } from '.';

export function Entity(
    name: string,
    options: SchemaOptions = {},
    globalFieldOptions: Exclude<MongooseTypes.FieldOptions, 'type'> = {}
) {
    return function (constructor: new (...args: any) => any) {
        const fields = constructor.prototype.fields;
        Object.keys(fields).forEach((key) => {
            fields[key] = { ...fields[key], ...globalFieldOptions };
        });
        const schema = new BaseSchema(fields, options);
        schema.loadClass(constructor);
        constructor['wrapper'] = { schema, name };
    };
}

export function Virtual(name: string, options: SchemaOptions = {}) {
    // return function (constructor: new (...args: any) => any) {
    //     const schema = new BaseSchema(constructor.prototype.fields, options);
    //     schema.loadClass(constructor);
    //     constructor['wrapper'] = { schema, name };
    // };
}
