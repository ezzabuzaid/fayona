import { Schema as MongooseSchema, SchemaDefinition, SchemaOptions } from 'mongoose';
export class BaseSchema<T> extends MongooseSchema<T> {
    constructor(def: SchemaDefinition, opt?: SchemaOptions, model?: Partial<T>) {
        super(def, {
            id: true,
            timestamps: true,
            skipVersioning: true,
            strict: true,
            versionKey: false,
            useNestedStrict: true,
            ...opt
        });
    }
}
