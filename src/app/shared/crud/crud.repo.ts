import assert from 'assert';
import { Model, FilterQuery } from 'mongoose';
import { Document, Payload, Projection, ColumnSort, PrimaryKey, ForeignKey } from '@lib/mongoose';
import { AppUtils } from '@core/utils';

// TODO: Before any query or write check the body to meet the
//  model to avoid [injections] this should be done in the repo.

export type Query<T> = FilterQuery<T>;

export class Repo<T> {
    constructor(
        public model: Model<Document<T>>
    ) {
        assert(AppUtils.notNullOrUndefined(model));
    }

    public fetchOne(query: Query<T>, projection: Projection<T> = {}, options = {}) {
        return this.model.findOne(query as any, projection, options);
    }

    public fetchAll(
        query?: Query<T>,
        options: Partial<IReadOptions<T>> = {}
    ) {
        return this.model.find(query as any, {}, options);
    }

    public fetchById(id: PrimaryKey) {
        return this.fetchOne({ _id: id } as any);
    }

    public create(payload: Payload<T>) {
        return new this.model(payload as any);
    }
}
interface IReadOneOptions<T> {
    projection?: Projection<T>;
    lean?: boolean;
    populate?: ForeignKeysOnly<T> | {
        path: keyof T,
        select?: string,
        match: any,
        options?: {},
        perDocumentLimit?: number
    } & IReadOneOptions<any>;
}

type ForeignKeysOnly<T> = {
    [P in keyof T]: ForeignKey extends T[P] ? P : never
}[keyof T];

export interface IReadAllOptions<T> {
    sort?: ColumnSort<T>;
    page?: number;
    size?: number;
}

export interface IReadOptions<T> extends IReadOneOptions<T>, IReadAllOptions<T> { }
