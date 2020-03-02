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

    @Get(`${Constants.Endpoints.USERS_SEARCH}/:username`, Auth.isAuthenticated)
    public async searchForUsers(req: Request, res: Response) {
        const { username } = req.params;
        if (AppUtils.isEmptyString(username)) {
            throw new Responses.BadRequest('username is not valid');
        }
        const users = await this.service.searchForUser(username);
        sendResponse(res, new Responses.Ok(users));
    }

}
