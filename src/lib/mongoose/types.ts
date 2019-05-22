import { SchemaTypeOpts, Schema, SchemaType } from "mongoose";

export namespace MongooseTypes {

    export type FieldOptions = SchemaTypeOpts<any> | Schema | SchemaType;
    export interface FieldAttr {
        fields: { [keys: string]: FieldOptions }
    }

}