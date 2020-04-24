import { CrudRouter } from '@shared/crud';
import usersService, { UserService } from './users.service';
import { Constants, Responses } from '@core/helpers';
import { Router, Post, Get } from '@lib/restful';
import { UsersSchema } from './users.model';
import { Request } from 'express';
import { AppUtils } from '@core/utils';
import { identity } from '@shared/identity';

@Router(Constants.Endpoints.USERS, {
    middleware: [identity.isAuthenticated()]
})
export class UsersRouter extends CrudRouter<UsersSchema, UserService> {
    constructor() {
        super(usersService);
    }

    @Post()
    public create(req: Request) {
        return super.create(req);
    }

    @Get(Constants.Endpoints.SEARCH)
    public async searchForUsers(req: Request) {
        let { username } = req.query;
        if (AppUtils.isEmptyString(username)) {
            username = '';
        }
        const users = await this.service.searchForUser(username);
        return new Responses.Ok(users);
    }

}
