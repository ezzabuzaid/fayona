import { Schema, SchemaType, SchemaTypeOpts } from 'mongoose';

export namespace MongooseTypes {

    export type FieldOptions = SchemaTypeOpts<any> | Schema | SchemaType;
    export interface IFieldAttr {
        fields: { [keys: string]: FieldOptions };
    }

}
