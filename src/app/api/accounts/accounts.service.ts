import { AccountRepo } from './accounts.repo';
import { CrudService } from '@shared/crud';
import { AccountSchema, AccountModel } from './accounts.model';
import { Repo } from '@shared/crud/crud.repo';

class AccountService extends CrudService<AccountSchema> {
    constructor() {
        super(new Repo(AccountModel));
    }

    public deleteAccount(user_id) {
        return this.delete({ user_id });
    }
    public createAccount(user_id) {
        return this.create({ user_id });
    }

    public async getEntityByUserId(user_id) {
        const entity = await this.one({ user_id });
        return entity.populate('user_id').execPopulate();

    }
}
export default new AccountService();
