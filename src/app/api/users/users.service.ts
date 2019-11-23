import accountsService from '@api/accounts/accounts.service';
import { UsersSchema, UsersModel } from './users.model';
import { CrudService } from '@shared/crud/crud.service';
import { usersRepo } from '.';

// Validate the body to meet the schema exactly using reflect metadata
class UserService extends CrudService<UsersSchema> {
    constructor() {
        super(usersRepo, {
            unique: ['username', 'email', 'password'],
            create: {
                async pre(entity) {
                    // TODO: Instead of invoke this function in hook invoke it in password setter
                    await entity.hashUserPassword();
                },
            }
        });
    }
}
export default new UserService();
