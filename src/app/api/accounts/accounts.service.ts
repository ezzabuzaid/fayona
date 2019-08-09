import { AccountRepo } from './accounts.repo';

export class AccountService {
    public static async createAccountForUser(user_id) {
        await AccountRepo.createEntity({ user_id });
    }
}

