import usersModel, { UsersSchema, } from './users.model';
import { CrudService, } from '@shared/crud/crud.service';
import { Repo, Pagination } from '@shared/crud';
import { Payload, } from '@lib/mongoose';

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

    async create(payload: Payload<UsersSchema>) {
        const user = await super.create(payload);
        // TODO: send a verification email
        // EmailService.sendEmail(fakeEmail());
        return user;
    }

}
export default new UserService();
