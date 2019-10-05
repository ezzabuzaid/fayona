import { Body, Document } from '@lib/mongoose';
import { PickAttr } from '@core/utils';

export interface ICrudHooks<T> {
    pre?: (doc: Document<T>) => any;
    post?: (doc: Document<T>) => any;
}

export interface ICrudOperation<T = any> {
    create?: ICrudHooks<T>;
    update?: ICrudHooks<T>;
    delete?: ICrudHooks<T>;
    one?: ICrudHooks<T>;
    all?: {
        post: (docs: Array<Document<T>>) => any
    };
}
export interface ICrudOptions<T> extends ICrudOperation<T> {
    // TODO: Move it to each crud operation without the [attr] key
    unique: Array<{
        attr: keyof Body<T>,
    }>;
}
