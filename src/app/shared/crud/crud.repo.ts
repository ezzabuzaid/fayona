import { Model } from 'mongoose';
import { Document, Body } from '@lib/mongoose';

// TODO: Before any query or write check the body to met the
//  model to avoid [injections] this should be done in the repo.
export class Repo<T> {
    constructor(
        public model: Model<Document<T>>
    ) { }

    public fetchOne(query: Partial<Body<T>>, ...args) {
        return this.model.findOne(query, ...args);
    }

    public fetchAll(query: Partial<Body<T>> = {}, ...args) {
        return this.model.find(query, ...args);
    }

    public fetchById(id: string) {
        return this.fetchOne({ _id: id } as any);
    }

    public create(body: Body<T>) {
        return new this.model(body as any);
    }
}
