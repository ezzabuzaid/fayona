import { model, Document } from 'mongoose';

export function BaseModel<T>(schemaClass) {
    const { wrapper }: any = schemaClass;
    return model<T & Document>(wrapper.name, wrapper.schema);
}


