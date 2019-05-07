import { Schema as MongooseSchema, SchemaDefinition, SchemaOptions } from 'mongoose';
export class BaseSchema<T> extends MongooseSchema<T> {
    constructor(def: SchemaDefinition, opt?: SchemaOptions, model?: Partial<T>) {
        super(def, {
            timestamps: true,
            skipVersioning: true,
            useNestedStrict: true,
            strict: true,
            id: true,
            ...opt
        });
    }
}