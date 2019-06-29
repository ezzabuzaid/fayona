import { AdminModel, AdminSchema } from './admin.model';

export class AdminRepo extends AdminModel {
    public static async createEntity(doc: Partial<AdminSchema>) {
        const user = new AdminRepo(doc);
        await user.hashUserPassword();
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
