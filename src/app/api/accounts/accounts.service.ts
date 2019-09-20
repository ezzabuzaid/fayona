import { AccountRepo } from './accounts.repo';

class AccountService {
    public deleteAccount(user_id) {
        return AccountRepo.delete(user_id);
    }
    public createAccount(user_id) {
        return AccountRepo.create({user_id});
    }
}
export default new AccountService();
