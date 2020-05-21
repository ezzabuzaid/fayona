import usersModel, { UsersSchema, } from './users.model';
import { CrudService, } from '@shared/crud/crud.service';
import { Repo, Pagination } from '@shared/crud';
import { EmailService } from '@shared/email';

export class UserService extends CrudService<UsersSchema> {
    constructor() {
        super(new Repo(usersModel), {
            unique: ['username', 'email', 'mobile']
        });
    }

    public searchForUser(username: string, options: Pagination) {
        return this.all({
            username: {
                $regex: username,
                $options: 'i'
            }
        }, options);
    }
}
export default new UserService();
