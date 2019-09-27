import accountsService from '@api/accounts/accounts.service';
import { UsersSchema, UsersModel } from './users.model';
import { CrudService } from '@shared/crud/crud.service';
import { usersRepo } from '.';

// Validate the body to meet the schema exactly using reflect metadata
class UserService extends CrudService<UsersSchema> {
    constructor() {
        super(usersRepo, {
            unique: [{ attr: 'username' }, { attr: 'email' }],
            create: {
                async pre(entity) {
                    await entity.hashUserPassword();
                },
                async post(entity) {
                    await accountsService.createAccount(entity.id);
                }
            },
            delete: {
                async post(entity) {
                    await accountsService.deleteAccount(entity.id);
                }
            },
        });
    }
}
export default new UserService();
