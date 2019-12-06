import { UsersSchema } from './users.model';
import { CrudService } from '@shared/crud/crud.service';
import { usersRepo } from '.';
import { EmailService, fakeEmail } from '@shared/email';

// TODO: provide an option for strict schema checking to not allowed
// an additional attribute to come, moreover check the types
// TODO: Validate the body to meet the schema exactly using reflect metadata
class UserService extends CrudService<UsersSchema> {
    constructor() {
        super(usersRepo, {
            unique: ['username', 'email'],
            create: {
                post(entity) {
                    EmailService.sendEmail(fakeEmail());
                }
            }
        });
    }
}
export default new UserService();
