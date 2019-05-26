import { UsersModel } from './users.model';
import { HashService } from '@core/helpers';

import { Logger } from '@core/utils';
const log = new Logger('Users Repo');

export class UsersRepo extends UsersModel {
    private constructor(doc) {
        super(doc);
    }

    static async createEntity(doc: Partial<UsersModel>) {
        const user = new UsersRepo(doc);
        await user.hashUserPassword()
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

    async hashUserPassword() {
        this.password = await HashService.hashPassword(this.password);
        return this;
    }

    async comparePassword(candidatePassword: string) {
        return HashService.comparePassword(candidatePassword, this.password);
    }

}