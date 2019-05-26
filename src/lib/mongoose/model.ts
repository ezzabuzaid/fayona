import { model, Document } from 'mongoose';

export const BaseModel = (function BaseModel() {
    return model<Document>('', {} as any);
})();
