import { CrudRouter, Pagination } from '@shared/crud';
import usersService, { UserService } from './users.service';
import { Constants } from '@core/helpers';
import { Router, Post, Get } from '@lib/restful';
import { UsersSchema } from './users.model';
import { Request } from 'express';
import { cast, StopWatch } from '@core/utils';
import { identity } from '@shared/identity';
import { validate } from '@shared/common';
import { IsString, IsOptional } from 'class-validator';
import { AccountsRouter } from '@api/profiles';
import { EmailService } from '@shared/email';
import { NodeServer } from '../../server';
import { Responses, SuccessResponse } from '@core/response';
class UsernameValidator extends Pagination {
    @IsOptional()
    @IsString()
    public username: string = null;
}

@Router(Constants.Endpoints.USERS, {
    middleware: [identity.isAuthenticated()],
    children: [AccountsRouter]
})
export class UsersRouter extends CrudRouter<UsersSchema, UserService> {
    constructor() {
        super(usersService);
    }

    @Post()
    public async create(req: Request) {
        const stopwatch = new StopWatch();
        stopwatch.start();
        const payload = cast<UsersSchema>(req.body);
        const result = await this.service.create(payload);
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        EmailService.sendVerificationEmail(NodeServer.serverUrl(req), payload.email, result.data._id);
        stopwatch.start();
        stopwatch.printElapsed();
        return new SuccessResponse(result.data, 'An e-mail has been sent to your email inbox in order to verify the account');
    }

    @Get(Constants.Endpoints.SEARCH, validate(UsernameValidator, 'query'))
    public async searchForUsers(req: Request) {
        const { username, ...options } = cast<UsernameValidator>(req.query);
        const users = await this.service.searchForUser(username, options);
        return new Responses.Ok(users.data);
    }

    @Get('username', validate(UsernameValidator, 'query'))
    public async isUsernameExist(req: Request, ) {
        const { username } = cast<UsernameValidator>(req.query);
        const result = await this.service.one({ username });
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        return new Responses.Ok(result.data);
    }

}
