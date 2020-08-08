import { AppUtils } from '@core/utils';
import { IColumnSort, Document, ForeignKey, locateModel, Payload, PrimaryKey, Projection } from '@lib/mongoose';
import { Type } from '@lib/utils';
import assert from 'assert';
import { FilterQuery, Model } from 'mongoose';

// TODO: Before any query or write check the body to meet the
//  model to avoid [injections] this should be done in the repo.

export type Query<T> = FilterQuery<T>;

export class CrudDao<T> {
    public model: Model<Document<T>>;
    constructor(model: Type<any>) {
        assert(AppUtils.notNullOrUndefined(model));
        this.model = locateModel(model);
    }

    public fetchOne(query: Query<T>, options?: IReadOneOptions<T>) {
        return this.model.findOne(query as any, options?.projection, options as any);
    }

    public fetchAll(
        query?: Query<T>,
        options: Partial<IReadOptions<T>> = {}
    ) {
        return this.model.find(query as any, options.projection, options as any);
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
    sort?: IColumnSort<T>;
    page?: number;
    size?: number;
}
export interface IReadOptions<T> extends IReadOneOptions<T>, IReadAllOptions<T> { }
