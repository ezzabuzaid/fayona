import { CrudRouter } from '@shared/crud';
import usersService, { UserService } from './users.service';
import { Constants, Responses, sendResponse } from '@core/helpers';
import { Router, Post, Delete, Get } from '@lib/methods';
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
    public create(req: Request, res: Response) {
        return super.create(req, res);
    }

    @Get(Constants.Endpoints.SEARCH, Auth.isAuthenticated)
    public async searchForUsers(req: Request, res: Response) {
        let { username } = req.query;
        if (AppUtils.isEmptyString(username)) {
            username = '';
        }
        const users = await this.service.searchForUser(username);
        sendResponse(res, new Responses.Ok(users));
    }

}
