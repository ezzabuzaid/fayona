import { UsersSchema } from './users.model';
import { CrudService } from '@shared/crud/crud.service';
import { usersRepo } from '.';

// TODO: provide an option for strict schema checking to not allowed
// an additional attribute to come, morever check the types
// TODO: Validate the body to meet the schema exactly using reflect metadata
class UserService extends CrudService<UsersSchema> {
    constructor() {
        super(usersRepo, {
            unique: ['username', 'email'],
        });
    }
}
export default new UserService();
