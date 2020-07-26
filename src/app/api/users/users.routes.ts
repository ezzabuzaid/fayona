import { AccountsRouter } from '@api/profiles';
import { Constants } from '@core/helpers';
import { Responses, SuccessResponse } from '@core/response';
import { FromBody, FromQuery, HttpGet, HttpPost, Route } from '@lib/restful';
import { CrudRouter, Pagination } from '@shared/crud';
import { EmailService } from '@shared/email';
import { identity } from '@shared/identity';
import { IsOptional, IsString } from 'class-validator';
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

    @HttpPost('testCreate')
    public async creates(@FromBody(UsersSchema) body: UsersSchema) {
        const result = await this.service.create(body);
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        EmailService.sendVerificationEmail(body.email, result.data.id);
        return new SuccessResponse(result.data, 'An e-mail has been sent to your email inbox in order to verify the account');
    }

    @HttpGet(Constants.Endpoints.SEARCH)
    public async searchForUsers(@FromQuery(UsernameValidator) query: UsernameValidator) {
        const { username, ...options } = query;
        const users = await this.service.searchForUser(username, options);
        return new Responses.Ok(users.data);
    }

    @HttpGet('username')
    public async isUsernameExist(@FromQuery(UsernameValidator) query: UsernameValidator) {
        const { username } = query;
        const result = await this.service.one({ username });
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        return new Responses.Ok(result.data);
    }

}
