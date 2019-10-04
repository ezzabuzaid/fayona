import { Document, model, Model } from 'mongoose';

// TODO after doing a base schema interface use it here _schema
export function BaseModel<T>(_schema) {
    const { wrapper }: any = _schema;
    // TODO use enum to get the name of property
    if (_schema) {
        return model<T & Document>(wrapper.name, wrapper.schema);
    }
}

export type FilterModel<Base, Condition = Model<Base & Document>> = {
    [Key in keyof Base]:
    Base[Key] extends Condition ? Key : never
};

export type Document<T> = Document & T;
