import { Document, model, Model } from 'mongoose';

export function BaseModel<T>(_schema) {
    const { wrapper }: any = _schema;
    // TODO use enum to get the name of property
    return model<T & Document>(wrapper.name, wrapper.schema);
}

export type FilterModel<Base, Condition = Model<Base & Document>> = {
    [Key in keyof Base]:
    Base[Key] extends Condition ? Key : never
};
