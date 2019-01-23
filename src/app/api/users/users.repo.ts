import { UsersModel } from './users.model';
import { HashService } from '@core/helpers';

import { Logger } from '@core/utils';
const log = new Logger('Users Repo');

export class UsersRepo extends UsersModel {
    private constructor(doc) {
        // doc must be of type user
        super(doc);
    }

    static async createUser(doc) {
        const user = new UsersRepo(doc)
        user.password = await HashService.hashPassword(user.password)
        return user.save();
    }

    static fetchUser(obj, ...args) {
        // obj must be of type user
        return this.findOne(obj, ...args);
    };

    static fetchUsers(obj?, ...args) {
        // obj must be of type user
        return this.find(obj, ...args);
    };

    async comparePassword(candidatePassword: string) {
        return HashService.comparePassword(candidatePassword, this.password);
    }

}