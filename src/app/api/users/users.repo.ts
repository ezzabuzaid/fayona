import { UsersModel, UsersType } from './users.model';
import { HashService } from '@core/helpers';

import { Logger } from '@core/utils';
const log = new Logger('Users Repo');

export class UsersRepo extends UsersModel {
    private constructor(doc) {
        // doc must be of type user
        super(doc);
    }

    static async createEntity(doc: Partial<UsersType.Model>) {
        // type error take exactly the attribute of the entity
        const user = new UsersRepo(doc)
        user.password = await HashService.hashPassword(user.password)
        return user.save();
    }

    static fetchEntity(obj, ...args) {
        // obj must be of type user
        return this.findOne(obj, ...args);
    };

    static deleteEntity(obj) {
        // obj must be of type user
        return this.findOneAndDelete(obj);
    }

    static entityExist(obj) {
        return this.fetchEntity(obj, {}, { lean: true });
    }

    static fetchEntities(obj?, ...args) {
        // obj must be of type user
        return this.find(obj, ...args);
    };

    async comparePassword(candidatePassword: string) {
        return HashService.comparePassword(candidatePassword, this.password);
    }

}