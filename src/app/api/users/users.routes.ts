import usersService from './users.service';
import { Constants } from '@core/helpers';
import { Logger } from '@core/utils';
import { Router } from '@lib/methods';
import { CrudRouter } from '@shared/crud';
import { UsersSchema } from './users.model';

const log = new Logger('UsersRouter');

@Router(Constants.Endpoints.USERS)
export class UsersRouter 
// extends CrudRouter<UsersSchema>
 {
    // constructor() {
        // super(usersService);
    // }
}
