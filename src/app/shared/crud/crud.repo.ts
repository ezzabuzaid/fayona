import assert from 'assert';
import { Model } from 'mongoose';
import { Document, Payload, Projection } from '@lib/mongoose';
import { AppUtils } from '@core/utils';

// TODO: Before any query or write check the body to meet the
//  model to avoid [injections] this should be done in the repo.
export class Repo<T> {
    constructor(
        public model: Model<Document<T>>
    ) {
        assert(AppUtils.notNullOrUndefined(model));
    }

    public fetchOne(query: Partial<Payload<T>>, projection: Projection<T> = {}) {
        return this.model.findOne(query, projection);
    }

    public fetchAll(query: Partial<Payload<T>> = {}, projection: Projection<T> = {}, options = {}) {
        return this.model.find(query, projection, options);
    }

    public fetchById(id: string) {
        return this.fetchOne({ _id: id } as any);
    }

    public create(payload: Payload<T>) {
        return new this.model(payload as any);
    }
}
