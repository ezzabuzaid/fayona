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
// https://typeorm.io

//     Documents
// ‘Documents’ are equivalent to records or rows of data in SQL.While a SQL row can reference data in other tables, Mongo documents usually combine that in a document.

//     Fields
// ‘Fields’ or attributes are similar to columns in a SQL table.

//     Schema
// While Mongo is schema - less, SQL defines a schema via the table definition.A Mongoose ‘schema’ is a document data structure(or shape of the document) that is enforced via the application layer.

//     Models
// ‘Models’ are higher - order constructors that take a schema and create an instance of a document equivalent to records in a relational database.
