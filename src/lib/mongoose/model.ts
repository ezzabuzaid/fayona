import { model, Document } from 'mongoose';

export const BaseModel = (function _BaseModel<T>() {
    return model<T & Document>('', {} as any);
}());

// export class ExpressRouter extends (function ExpressRouter() {
//     return (express.Router as any) as (new () => express.Router)
// }()) { }
