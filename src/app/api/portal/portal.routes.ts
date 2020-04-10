import { Constants, Responses, HashService } from '@core/helpers';
import { Post, Router } from '@lib/methods';
import { Request, Response } from 'express';
import usersService from '@api/users/users.service';
import { UsersSchema } from '@api/users';
import { Payload, WithID, PrimaryKey } from '@lib/mongoose';
import { EmailService, fakeEmail } from '@shared/email';
import { AppUtils, cast } from '@core/utils';
import { PortalHelper } from './portal.helper';
import { TokenExpiredError } from 'jsonwebtoken';
import { ApplicationConstants } from '@core/constants';
import { sessionsService } from '@api/sessions/sessions.service';
import { IsString } from 'class-validator';
import { translate } from '@lib/translation';
import { scheduleJob } from 'node-schedule';
import { validate } from '@shared/common';
import { tokenService, IRefreshTokenClaim } from '@shared/identity';
import { Query } from '@shared/crud';

export class LoginPayload {
    @IsString({
        message: translate('string_constraint', { name: 'username' })
    }) public username: string = null;

    @IsString({
        message: translate('string_constraint', { name: 'password' })
    }) public password: string = null;
}

export class RefreshTokenDto {
    public token: string;
    public refreshToken: string;
    constructor(user: Payload<WithID<UsersSchema>>) {
        this.token = PortalHelper.generateToken(user.id, user.role);
        this.refreshToken = PortalHelper.generateRefreshToken(user.id);
    }
}

export class LoginDto extends RefreshTokenDto {
    public others_folder = 'others';
    constructor(
        user: ConstructorParameters<typeof RefreshTokenDto>[0],
        public session_id: PrimaryKey,
    ) {
        super(user);
    }
}

export class RefreshTokenPayload {
    @IsString()
    public token: string = null;
    @IsString()
    public refreshToken: string = null;
    @IsString()
    public uuid: string = null;
}

@Router(Constants.Endpoints.PORTAL)
export class PortalRoutes {
    constructor() {
        console.log('constructor');
        // EmailService.sendEmail({
        //     to: 'ezzabuzaid@hotmail.com',
        //     cc: 'superadmin@test.com,admin@test.com',
        //     text: 'A test email'
        // }).then(console.log);
    }
    @Post(Constants.Endpoints.LOGIN, validate(LoginPayload))
    public async login(req: Request) {
        // TODO: send an email to user to notify him about login attempt.

        const { username, password } = cast<LoginPayload>(req.body);
        const device_uuid = req.header(ApplicationConstants.deviceIdHeader);

        if (AppUtils.isFalsy(device_uuid)) {
            return new Responses.BadRequest();
        }

        // STUB it should throw if username is falsy type or if it's not in database
        const user = await throwIfNotExist({ username }, 'wrong_credintals');

        // STUB it should pass if password is right
        const isPasswordEqual = HashService.comparePassword(password, user.password);
        if (AppUtils.isFalsy(isPasswordEqual)) {
            return new Responses.BadRequest('wrong_credintals');
        }
        const activeUserSessions = await sessionsService.getActiveUserSession(user.id);

        if (activeUserSessions.data.length >= 10) {
            return new Responses.BadRequest('exceeded_allowed_sesison');
        }
        // STUB it should create a session entity
        const session = await sessionsService.create({
            device_uuid,
            active: true,
            user: user.id
        });

        // STUB test the refreshToken claims should have only entity id with expire time 12h
        // STUB test token claims must have only entity id and role with 30min expire time
        return new Responses.Ok(new LoginDto(user, session.data.id));

    }

    @Post(Constants.Endpoints.LOGOUT + '/:uuid')
    public async logout(req: Request) {
        const device_uuid = req.params.uuid;
        if (device_uuid) {
            const result = await sessionsService.deActivate({ device_uuid });
            if (AppUtils.not(result.hasError)) {
                return new Responses.Ok(result.data);
            }
        }
        return new Responses.BadRequest('logout_wrong_device_uuid');
    }

    @Post(Constants.Endpoints.REFRESH_TOKEN, validate(RefreshTokenPayload))
    public async refreshToken(req: Request) {
        const { uuid, token, refreshToken } = cast<RefreshTokenPayload>(req.body);

        // NOTE: if it was invalid or expired it will implicity thrown an error
        const decodedRefreshToken = await tokenService.decodeToken<IRefreshTokenClaim>(refreshToken);
        // TODO if refresh token was expired then deactive the user session

        try {
            await tokenService.decodeToken(token);
        } catch (error) {
            if (error instanceof TokenExpiredError) {

                const session = await sessionsService.getActiveSession({
                    device_uuid: uuid,
                    user: decodedRefreshToken.id
                });

                if (AppUtils.isFalsy(session)) {
                    throw new Responses.Unauthorized('not_allowed');
                }

                const user = await throwIfNotExist({ _id: decodedRefreshToken.id });
                return new RefreshTokenDto(user);
            } else {
                throw error;
            }
        }
        throw new Responses.BadRequest('not_allowed');
    }

    @Post(Constants.Endpoints.FORGET_PASSWORD)
    public async forgotPassword(req: Request, res: Response) {
        const { username } = req.body as Payload<UsersSchema>;
        const entity = await throwIfNotExist({ username }, 'Error sending the password reset message. Please try again shortly.');
        const token = tokenService.generateToken({ id: entity.id, role: entity.role }, { expiresIn: '1h' });
        await EmailService.sendEmail(fakeEmail(token));
        const response = new Responses.Ok('An e-mail has been sent to ${user.email} with further instructions');
        res.status(response.code).json(response);
    }

    @Post(Constants.Endpoints.RESET_PASSWORD)
    public async resetPassword(req: Request, res: Response) {
        // REVIEW if anyone get the token can change the user password,
        // so we need to know that the user who really did that by answering a specifc questions, doing 2FA
        // the attempts should be limited to 3 times, after that he need to re do the process again,
        // if the procces faild 3 times, the account should be locked, and he need to call the support for that
        const { password } = req.body as Payload<UsersSchema>;
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        await usersService.updateById(decodedToken.id, { password });
        const response = new Responses.Ok(null);
        await EmailService.sendEmail(fakeEmail());
        res.status(response.code).json(response);
    }

    // TODO: the user should verify his email and phonenumber
    public async verify(req: Request, res: Response) {
        const { token } = req.query;
        const decodedToken = await tokenService.decodeToken(token);
        await usersService.updateById(decodedToken.id, { verified: true });
        const response = new Responses.Ok(null);
        res.status(response.code).json(response);
    }

    public async sendVerificationEmail(req: Request, res: Response) {
        const { token } = req.query;
        const decodedToken = await tokenService.decodeToken(token);
        await usersService.updateById(decodedToken.id, { verified: true });
        const response = new Responses.Ok(null);
        res.status(response.code).json(response);
    }

}

async function throwIfNotExist(query: Query<UsersSchema>, message = 'not_exist') {
    if (AppUtils.isFalsy(query)) {
        throw new Responses.BadRequest(message);
    }
    const entity = await usersService.one(query, { projection: { password: 1 } });
    if (entity.hasError) {
        throw new Responses.BadRequest(message);
    }
    return entity.data;
}

scheduleJob('30 * * * *', async () => {
    const sessions = await sessionsService.getAllActiveSession();
    sessions.data.list.forEach((session) => {
        // TODO deActivate usless sessions
    });
});

// TODO: Forget and reset password scenario
// Enter a unique info like partial of profile info page 1
// Security questions page 2
// send an email with generated number to be entered later on in page 3
// Lock the account after 3 times of trying
// send an email to notify the user that the email is changed

// TODO: The admin should be able to end opened user session

// TODO: use black listed jwt and make a function
// to remove them when any expired (use redies),
// or just fetch the sessions again on each request
// to check if certin
