import { UsersModel } from './users.model';
import { HashService } from '@core/helpers';

import { Logger } from '@core/utils';
import { BaseModel } from '@lib/mongoose';
const log = new Logger('Users Repo');
export class UsersRepo extends BaseModel<UsersModel>(UsersModel) {
    private constructor(doc) {
        super(doc);
    }

    static async createEntity(doc: Partial<UsersModel>) {
        const user = new UsersRepo(doc);
        await user.hashUserPassword();
        return user.save();
    }

    static fetchEntity(obj, ...args) {
        return this.findOne(obj, ...args);
    };

    static deleteEntity(obj) {
        return this.findOneAndDelete(obj);
    }

    static entityExist(obj) {
        return this.fetchEntity(obj, {}, { lean: true });
    }

    static fetchEntities(obj?, ...args) {
        return this.find(obj, ...args);
    };

}
