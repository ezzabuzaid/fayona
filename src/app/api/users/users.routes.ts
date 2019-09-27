import { CrudRouter } from '@shared/crud';
import usersService from './users.service';
import { Constants } from '@core/helpers';
import { Logger } from '@core/utils';
import { Router } from '@lib/methods';
import { UsersSchema } from './users.model';

const log = new Logger('UsersRouter');
@Router(Constants.Endpoints.USERS, {
    crud: {
        create: []
    }
})
export class UsersRouter extends CrudRouter<UsersSchema> {
    constructor() {
        super(usersService);
    }
}
