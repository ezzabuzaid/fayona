import { CrudRouter } from '@shared/crud/crud.router';
import usersService from './users.service';
import { Constants } from '@core/helpers';
import { Router, Post, Delete } from '@lib/methods';
import { UsersSchema } from './users.model';
import { Request, Response } from 'express';

@Router(Constants.Endpoints.USERS)
export class UsersRouter extends CrudRouter<UsersSchema> {
    constructor() {
        super(usersService);
    }

    @Post()
    public create(req: Request, res: Response) {
        return super.create(req, res);
    }

}
