import { UsersSchema, } from './users.model';
import { CrudService, } from '@shared/crud/crud.service';
import { Repo, Pagination } from '@shared/crud';
import { Singelton } from '@lib/locator';

@Singelton()
export class UserService extends CrudService<UsersSchema> {
    constructor() {
        super(new Repo(UsersSchema), {
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
