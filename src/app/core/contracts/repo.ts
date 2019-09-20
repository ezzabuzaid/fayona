import { Model } from 'mongoose';
import { Document } from '@lib/mongoose';
// TODO use repo and complete it
export class Repo<T> {
    constructor(
        public model: Model<Document<T>>
    ) { }

    // TODO obj type should be Partial<Body<T>>
    public fetchOne(obj: any, ...args) {
        return this.model.findOne(obj, ...args).lean();
    }

    public fetchAll(obj?, ...args) {
        return this.model.find(obj, ...args);
    }

    public fetchById(id: string) {
        return this.model.findById(id);
    }
}
