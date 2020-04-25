import { CrudRouter, Pagination } from '@shared/crud';
import usersService, { UserService } from './users.service';
import { Constants, Responses } from '@core/helpers';
import { Router, Post, Get } from '@lib/restful';
import { UsersSchema } from './users.model';
import { Request } from 'express';
import { cast } from '@core/utils';
import { identity } from '@shared/identity';
import { validate } from '@shared/common';
import { IsString, IsOptional } from 'class-validator';

class SearchForUserQueryValidator extends Pagination {
    @IsOptional()
    @IsString()
    public username: string = null;
}

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

    @Get(Constants.Endpoints.SEARCH, validate(SearchForUserQueryValidator, 'query'))
    public async searchForUsers(req: Request) {
        const { username, ...options } = cast<SearchForUserQueryValidator>(req.query);
        const users = await this.service.searchForUser(username, options);
        return new Responses.Ok(users.data);
    }

}
