import { CrudRouter } from '@shared/crud';
import usersService from './users.service';
import { Constants, SuccessResponse, NetworkStatus } from '@core/helpers';
import { Router, Post } from '@lib/methods';
import { UsersSchema } from './users.model';
import { Request, Response } from 'express';
import { translate } from '@lib/translation';

@Router(Constants.Endpoints.USERS)
export class UsersRouter extends CrudRouter<UsersSchema> {
    constructor() {
        super(usersService);
    }

    @Post('')
    public async create(req: Request, res: Response) {
        return super.create(req, res);
    }

}
