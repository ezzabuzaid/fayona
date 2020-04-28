import { Payload, Document } from '@lib/mongoose';

export interface ICrudHooks<T> {
    pre?: (document: Document<T>) => any;
    post?: (document: Document<T>) => any;
}

export interface ICrudOperation<T = any> {
    create?: ICrudHooks<T>;
    update?: ICrudHooks<T>;
    delete?: ICrudHooks<T>;
}
export interface ICrudOptions<T> extends ICrudOperation<T> {
    /**
     * indicate that the entity should be unique, and the check will be on the provided properties
     */
    unique?: Array<keyof Payload<T>>;
}
