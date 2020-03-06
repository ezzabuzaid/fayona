import { Payload, Document } from '@lib/mongoose';
import { DocumentQuery } from 'mongoose';

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
        pre?: (doc: DocumentQuery<Array<Document<T>>, Document<T>>) => any;
        post?: (doc: DocumentQuery<Array<Document<T>>, Document<T>>) => any;
    };
}
export interface ICrudOptions<T> extends ICrudOperation<T> {
    /**
     * indicate that the entity should be unique, and the check will be on the provided properties
     */
    unique?: Array<keyof Payload<T>>;
}
