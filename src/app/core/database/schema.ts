import { Schema as MongooseSchema, SchemaDefinition, SchemaOptions } from 'mongoose';
export class BaseSchema<T> extends MongooseSchema<T> {
    constructor(def: SchemaDefinition, opt?: SchemaOptions) {
        super(def, {
            id: true,
            timestamps: true,
            skipVersioning: true,
            strict: 'throw',
            versionKey: false,
            useNestedStrict: true,
            validateBeforeSave: true,
            ...opt
        });
    }
}
