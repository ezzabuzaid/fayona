import { AccountsRouter, ProfilesSchema } from '@api/profiles';
import { Constants } from '@core/helpers';
import { Responses, SuccessResponse } from '@core/response';
import { FromBody, FromQuery, HttpGet, HttpPost, Route } from '@lib/restful';
import { CrudRouter, Pagination } from '@shared/crud';
import { EmailService } from '@shared/email';
import { identity } from '@shared/identity';
import { IsOptional, IsString, IsEmail } from 'class-validator';
import { UsersSchema } from './users.model';
import { UserService } from './users.service';
import { locate } from '@lib/locator';
class UsernameValidator extends Pagination {
    @IsOptional()
    @IsString()
    public username: string = null;
}

class CreateUserDto {
    @IsString()
    public username: string = null;

    @IsString()
    public password: string = null;

    @IsEmail()
    public email: string = null;

    @IsString()
    public mobile: string = null;

    @IsOptional()
    public profile: ProfilesSchema = null;
}

@Route(Constants.Endpoints.USERS, {
    // middleware: [identity.isAuthenticated()],
    children: [AccountsRouter]
})
export class UsersRouter extends CrudRouter<UsersSchema, UserService> {
    constructor() {
        super(locate(UserService));
    }

    @HttpPost()
    // TODO: Use AllowAnonymous()
    public async create(@FromBody(CreateUserDto) body: CreateUserDto) {
        const { data } = await this.service.create(body);
        EmailService.sendVerificationEmail(body.email, data.id);
        return new SuccessResponse(data, 'An e-mail has been sent to your email inbox in order to verify the account');
    }

    @HttpGet(Constants.Endpoints.SEARCH)
    public async searchForUsers(@FromQuery(UsernameValidator) query: UsernameValidator) {
        const { username, ...options } = query;
        const users = await this.service.searchForUser(username, options);
        return new Responses.Ok(users.data);
    }

    @HttpGet('username', identity.isAuthenticated())
    public async isUsernameExist(@FromQuery(UsernameValidator) query: UsernameValidator) {
        const { username } = query;
        const result = await this.service.one({ username });
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        return new Responses.Ok(result.data);
    }

}
