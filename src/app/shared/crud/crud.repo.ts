import assert from 'assert';
import { Model } from 'mongoose';
import { Document, Payload, Projection, WithMongoID, ColumnSort, PrimaryID, ForeignKey } from '@lib/mongoose';
import { AppUtils } from '@core/utils';

// TODO: Before any query or write check the body to meet the
//  model to avoid [injections] this should be done in the repo.
export class Repo<T> {
    constructor(
        public model: Model<Document<T>>
    ) {
        assert(AppUtils.notNullOrUndefined(model));
    }

    public fetchOne(query: Partial<WithMongoID<Payload<T>>>, projection: Projection<T> = {}, options = {}) {
        return this.model.findOne(query, projection, options);
    }

    public fetchAll(
        query: Partial<WithMongoID<Payload<T>>> = {},
        options: Partial<IReadAllOptions<T>> = {}
    ) {
        return this.model.find(query, {}, options);
    }

    public fetchById(id: PrimaryID) {
        return this.fetchOne({ _id: id } as any);
    }

    public create(payload: Payload<T>) {
        return new this.model(payload as any);
    }
}
interface IReadOneOptions<T> {
    projection: Projection<T>;
    lean: boolean;
    populate: ForeignKeysOnly<T> | { path: keyof T, select: string };
}

type ForeignKeysOnly<T> = {
    [P in keyof T]: ForeignKey extends T[P] ? P : never
}[keyof T];

export interface IReadAllOptions<T> extends IReadOneOptions<T> {
    sort: ColumnSort<T>;
    page: number;
    size: number;
}
