import { Body, Document } from '@lib/mongoose';

export interface ICrudOperation<T = any> {
    create?: {
        pre?: (doc: Document<T>) => any;
        post?: (doc: Document<T>) => any;
    };
    update?: {
        pre?: (doc: Document<T>) => any;
        post?: (doc: Document<T>) => any;
    };
    delete?: {
        pre?: (doc: Document<T>) => any;
        post?: (doc: Document<T>) => any;
    };
}
export interface ICrudOptions<T> extends ICrudOperation<T> {
    unique: Array<{
        attr: keyof Body<T>,
    }>;
}
