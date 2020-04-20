import { UsersSchema, UsersModel } from './users.model';
import { CrudService } from '@shared/crud/crud.service';
import { Repo } from '@shared/crud';
import { Payload } from '@lib/mongoose';

export class UserService extends CrudService<UsersSchema> {
    constructor() {
        super(new Repo<UsersSchema>(UsersModel), {
            unique: ['username', 'email', 'mobile'],
            create: {
                result: (user) => user
            }
        });
    }

    public searchForUser(username: string) {
        return this.repo.fetchAll()
            .merge({ username: { $regex: username, $options: 'i' } })
            .exec();
    }

    async create(payload: Payload<UsersSchema>) {
        const user = await super.create(payload);
        // TODO: send a verification email
        // EmailService.sendEmail(fakeEmail());
        return user;
    }

}
export default new UserService();
