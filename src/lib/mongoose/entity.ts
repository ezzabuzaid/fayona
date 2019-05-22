import { Type, AppUtils } from '@core/utils';
import { SchemaOptions, Schema, model } from 'mongoose';
import { BaseSchema } from '@core/database';
import { MongooseTypes } from './types';
export function Entity<T = any>(name: string, options: SchemaOptions = {}) {
    return function (constructor: Type<T & MongooseTypes.FieldAttr>) {
        const schema = new BaseSchema<T>(constructor.prototype.fields, options);
        const { prototype } = constructor;
        const schemaPrototype = AppUtils.getPrototypeOf<typeof schema>(schema);
        // REVIEW is this what actully you want! why you extending the schema anyway!
        // for (const i in schemaPrototype) {
        //     prototype[i] = schemaPrototype[i]
        // }
        // constructor.prototype.constructor = model.prototype.constructor;
        return class extends model(name, schema) { } as unknown as T;
    }
}
