import { Body } from '@lib/mongoose';
import { FeedbackModel, FeedbackSchema } from './feedback.model';

export class FeedbackRepo extends FeedbackModel {
    public static async updateEntity(id: string, body: Body<FeedbackSchema>) {
        const entity = await this.fetchEntityById(id).lean();
        if (!entity) {
            return null;
        }
        entity.set(body);
        return entity.save();
    }
    public static createEntity(doc: Body<FeedbackSchema>) {
        const user = new FeedbackRepo(doc);
        return user.save();
    }

    public static fetchEntity(obj, ...args) {
        return this.findOne(obj, ...args);
    }

    public static deleteEntity(id: string) {
        return this.findOneAndDelete({ _id: id });
    }

    public static entityExist(obj) {
        return this.fetchEntity(obj).lean();
    }

    public static fetchEntities(obj?, ...args) {
        return this.find(obj, ...args);
    }

    public static fetchEntityById(id: string) {
        return this.fetchEntity({ _id: id });
    }
}
