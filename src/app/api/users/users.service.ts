import { UsersSchema, UsersModel } from './users.model';
import { CrudService } from '@shared/crud/crud.service';
import { EmailService, fakeEmail } from '@shared/email';
import { Repo } from '@shared/crud';

// TODO: provide an option for strict schema checking to not allowed
// an additional attribute to come, moreover check the types to
//  avoid inject unwanted data(perhaps it's implicitly has a query)

// TODO: Validate the body to meet the schema exactly using reflect metadata

export class UserService extends CrudService<UsersSchema> {
    constructor() {
        super(new Repo<UsersSchema>(UsersModel), {
            unique: ['username', 'email', 'mobile'],
            create: {
                pre(record) {
                    // TODO: normalize the mobile number in order to ensure the uniqueness
                },
                post(record) {
                    // EmailService.sendEmail(fakeEmail());
                }
            }
        });
    }

    searchForUser(username: string) {
        return this.repo.fetchAll()
            .merge({ username: { $regex: username, $options: 'i' } })
            .exec();
    }
}
export default new UserService();
