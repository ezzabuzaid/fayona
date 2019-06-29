import { Body } from '@lib/mongoose';
import { MealsModel, MealsSchema } from './meals.model';

export class MealsRepo extends MealsModel {
    public static async createEntity(doc: Body<MealsSchema>) {
        const user = new MealsRepo(doc);
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
