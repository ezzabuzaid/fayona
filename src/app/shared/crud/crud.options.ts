import { Body, Document } from '@lib/mongoose';

export interface ICrudOptions<T> {
    unique: Array<{
        attr: keyof Body<T>,
    }>;
    pre: {
        create?: (body: Document<T>) => any,
        delete?: (body: Document<T>) => any,
        update?: (body: Document<T>) => any,
    };
    post: {
        create?: (body: Document<T>) => any,
        delete?: (body: Document<T>) => any,
        update?: (body: Document<T>) => any,
    };
}
