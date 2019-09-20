import accountsService from '@api/accounts/accounts.service';
import { UsersSchema } from './users.model';
import { CrudService } from '@shared/crud/crud.service';
import { usersRepo } from '.';

// Validate the body to meet the schema exactly using reflect metadata
class UserService extends CrudService<UsersSchema> {
    constructor() {
        super(usersRepo, {
            unique: [{ attr: 'username' }, { attr: 'email' }],
            pre: {
                async create(entity) {
                    await entity.hashUserPassword();
                }
            },
            post: {
                async create(entity) {
                    await accountsService.createAccount(entity.id);
                },
                async delete(entity) {
                    await accountsService.deleteAccount(entity.id);
                }
            },
        });
    }
}
export default new UserService();
