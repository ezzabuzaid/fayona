import { CrudRouter, Pagination } from '@shared/crud';
import usersService, { UserService } from './users.service';
import { Constants, Responses, SuccessResponse } from '@core/helpers';
import { Router, Post, Get } from '@lib/restful';
import { UsersSchema } from './users.model';
import { Request } from 'express';
import { cast } from '@core/utils';
import { identity } from '@shared/identity';
import { validate } from '@shared/common';
import { IsString, IsOptional } from 'class-validator';
import { AccountsRouter } from '@api/profiles';
import { EmailService } from '@shared/email';
import { NodeServer } from 'app/server';
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
        const payload = cast<UsersSchema>(req.body);
        req.body.city = req.ip || req.connection.remoteAddress;
        const result = await this.service.create(payload);

        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        await EmailService.sendVerificationEmail(NodeServer.serverUrl(req), payload.email);
        return new SuccessResponse(result.data, 'An e-mail has been sent to your email in order to verify the account');
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
