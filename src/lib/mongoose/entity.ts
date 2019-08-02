import { BaseSchema } from '@core/database';
import { SchemaOptions } from 'mongoose';

export function Entity(name: string, options: SchemaOptions = {}) {
    return function (constructor: new (...args: any) => any) {
        const schema = new BaseSchema(constructor.prototype.fields, options);
        schema.loadClass(constructor);
        constructor['wrapper'] = { schema, name };
    };
}

export function Virtual(name: string, options: SchemaOptions = {}) {
    return function (constructor: new (...args: any) => any) {
        const schema = new BaseSchema(constructor.prototype.fields, options);
        schema.loadClass(constructor);
        constructor['wrapper'] = { schema, name };
    };
}
