import { CrudRouter } from '@shared/crud';
import usersService, { UserService } from './users.service';
import { Constants, Responses } from '@core/helpers';
import { Router, Post, Get } from '@lib/methods';
import { UsersSchema } from './users.model';
import { Request, Response } from 'express';
import { Auth } from '@api/portal';
import { AppUtils } from '@core/utils';

@Router(Constants.Endpoints.USERS)
export class UsersRouter extends CrudRouter<UsersSchema, UserService> {
    constructor() {
        super(usersService);
    }

    @Post()
    public create(req: Request) {
        return super.create(req);
    }

    @Get(Constants.Endpoints.SEARCH, Auth.isAuthenticated)
    public async searchForUsers(req: Request, res: Response) {
        let { username } = req.query;
        if (AppUtils.isEmptyString(username)) {
            username = '';
        }
        const users = await this.service.searchForUser(username);
        return new Responses.Ok(users);
    }

}
