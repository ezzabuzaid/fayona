import { Logger } from '@core/utils';
import { UsersModel, UsersSchema } from './users.model';
const log = new Logger('Users Repo');

export class UsersRepo extends UsersModel {
    public static async createEntity(doc: Partial<UsersSchema>) {
        const user = new UsersRepo(doc);
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
