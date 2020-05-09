import { CrudRouter, CrudService, Repo } from '@shared/crud';
import accountsModel, { AccountsSchema } from './accounts.model';
import { Constants } from '@core/helpers';
import { Router } from '@lib/restful';

@Router(Constants.Endpoints.ACCOUNTS)
export class AccountsRouter extends CrudRouter<AccountsSchema> {

    constructor() {
        super(new CrudService(new Repo(accountsModel)));
    }

}
