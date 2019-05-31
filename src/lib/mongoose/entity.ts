import { SchemaOptions } from 'mongoose';
import { BaseSchema } from '@core/database';
export function Entity(name: string, options: SchemaOptions = {}) {
    return function (constructor: new (...args: any) => any) {
        const schema = new BaseSchema(constructor.prototype.fields, options);
        // const { prototype } = constructor;
        // const schemaPrototype = AppUtils.getPrototypeOf<typeof schema>(schema);
        // REVIEW is this what actully you want! why you extending the schema anyway!
        // for (const i in schemaPrototype) {
        //     prototype[i] = schemaPrototype[i]
        // }
        // constructor.prototype.constructor = model.prototype.constructor;
        // return class extends model(name, schema) { } as unknown as T;
        schema.loadClass(constructor);
        constructor['wrapper'] = { schema, name };
        // return class extends constructor {
        //     constructor(...args) {
        //         super(args);
        //     }
        // };
    }
}
