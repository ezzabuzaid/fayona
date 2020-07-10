import { AccountsRouter } from '@api/profiles';
import { Constants } from '@core/helpers';
import { Responses, SuccessResponse } from '@core/response';
import { cast } from '@core/utils';
import { HttpGet, HttpPost, Route } from '@lib/restful';
import { validate } from '@shared/common';
import { CrudRouter, Pagination } from '@shared/crud';
import { EmailService } from '@shared/email';
import { identity } from '@shared/identity';
import { IsOptional, IsString } from 'class-validator';
import { Request } from 'express';
import { NodeServer } from '../../server';
import { UsersSchema } from './users.model';
import usersService, { UserService } from './users.service';
class UsernameValidator extends Pagination {
    @IsOptional()
    @IsString()
    public username: string = null;
}

@Route(Constants.Endpoints.USERS, {
    middleware: [identity.isAuthenticated()],
    children: [AccountsRouter]
})
export class UsersRouter extends CrudRouter<UsersSchema, UserService> {
    constructor() {
        super(usersService);
    }

    @HttpPost()
    public async create(req: Request) {
        const payload = cast<UsersSchema>(req.body);
        const result = await this.service.create(payload);
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        EmailService.sendVerificationEmail(NodeServer.serverUrl(req), payload.email, result.data._id);
        return new SuccessResponse(result.data, 'An e-mail has been sent to your email inbox in order to verify the account');
    }

    @HttpGet(Constants.Endpoints.SEARCH, validate(UsernameValidator, 'query'))
    public async searchForUsers(req: Request) {
        const { username, ...options } = cast<UsernameValidator>(req.query);
        const users = await this.service.searchForUser(username, options);
        return new Responses.Ok(users.data);
    }

    @HttpGet('username', validate(UsernameValidator, 'query'))
    public async isUsernameExist(req: Request) {
        const { username } = cast<UsernameValidator>(req.query);
        const result = await this.service.one({ username });
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        return new Responses.Ok(result.data);
    }

}
