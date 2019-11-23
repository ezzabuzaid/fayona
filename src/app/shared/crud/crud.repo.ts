import { Model, DeepPartial } from 'mongoose';
import { Document, Body } from '@lib/mongoose';
// TODO use repo and complete it
export class Repo<T> {
    constructor(
        public model: Model<Document<T>>
    ) { }

    // TODO obj type should be Partial<Body<T>>
    public fetchOne(obj: Partial<Body<T>>, ...args) {
        return this.model.findOne(obj, ...args);
    }

    public fetchAll(obj?, ...args) {
        return this.model.find(obj, ...args);
    }

    public fetchById(id: string) {
        return this.model.findById(id);
    }

    public create(body: Body<T>) {
        return new this.model(body as any);
    }
}
