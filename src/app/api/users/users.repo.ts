import { Logger } from '@core/utils';
import { UsersModel, UsersType } from './users.model';
import { HashService } from '@core/helpers';

const log = new Logger('Users Repo');
log.info('User repo');

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

    static async getUser(obj) {
        // obj must be of type user
        const user = await this.findOne(obj);
        return user;
    };

    async comparePassword(candidatePassword: string) {
        return HashService.comparePassword(candidatePassword, this.password);
    }

}