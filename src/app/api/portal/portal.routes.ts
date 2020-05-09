import { Constants, Responses, HashService } from '@core/helpers';
import { Post, Router } from '@lib/restful';
import { Request, Response } from 'express';
import usersService from '@api/users/users.service';
import { UsersSchema } from '@api/users';
import { Payload, PrimaryKey } from '@lib/mongoose';
import { EmailService, fakeEmail } from '@shared/email';
import { AppUtils, cast } from '@core/utils';
import { PortalHelper } from './portal.helper';
import { TokenExpiredError } from 'jsonwebtoken';
import { ApplicationConstants } from '@core/constants';
import { sessionsService } from '@api/sessions/sessions.service';
import { IsString, IsNotEmpty, IsJWT } from 'class-validator';
import { scheduleJob } from 'node-schedule';
import { validate } from '@shared/common';
import { tokenService, IRefreshTokenClaim } from '@shared/identity';
import { Query } from '@shared/crud';

export class CredentialsPayload {
    @IsString()
    @IsNotEmpty()
    public username: string = null;
    @IsString()
    @IsNotEmpty()
    public password: string = null;
}

export class RefreshTokenPayload {
    @IsString()
    @IsJWT()
    public token: string = null;
    @IsString()
    @IsJWT()
    public refreshToken: string = null;
}

export class DeviceUUIDHeaderValidator {
    @IsString()
    public [ApplicationConstants.deviceIdHeader] = null;
}

export class RefreshTokenDto {
    public token: string;
    public refreshToken: string;
    constructor(user_id: PrimaryKey, role: string) {
        this.token = PortalHelper.generateToken(user_id, role);
        this.refreshToken = PortalHelper.generateRefreshToken(user_id);
    }
}

export class LoginDto extends RefreshTokenDto { }

@Router(Constants.Endpoints.PORTAL)
export class PortalRoutes {

    static MAX_SESSION_SIZE = 10;
    constructor() {
        // EmailService.sendEmail({
        //     to: 'ezzabuzaid@hotmail.com',
        //     cc: 'superadmin@test.com,admin@test.com',
        //     text: 'A test email'
        // }).then(console.log);
    }

    @Post(Constants.Endpoints.LOGIN, validate(CredentialsPayload), validate(DeviceUUIDHeaderValidator, 'headers'))
    public async login(req: Request) {
        // TODO: send an email to user to notify him about login attempt.

        const { username, password } = cast<CredentialsPayload>(req.body);
        const device_uuid = req.header(ApplicationConstants.deviceIdHeader);

        const { data: user, ...result } = await usersService.one({ username }, {
            projection: {
                password: 1,
                role: 1
            }
        });
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        const isPasswordEqual = HashService.comparePassword(password, user.password);
        if (AppUtils.isFalsy(isPasswordEqual)) {
            return new Responses.BadRequest('wrong_credintals');
        }
        const activeUserSessions = await sessionsService.getActiveUserSession(user.id);
        if (activeUserSessions.data.length >= PortalRoutes.MAX_SESSION_SIZE) {
            return new Responses.BadRequest('exceeded_allowed_sesison');
        }
        await sessionsService.create({
            device_uuid,
            active: true,
            user: user.id
        });
        return new Responses.Ok(new LoginDto(user.id, user.role));

    }

    @Post(Constants.Endpoints.LOGOUT, validate(DeviceUUIDHeaderValidator, 'headers'))
    public async logout(req: Request) {
        const device_uuid = req.header(ApplicationConstants.deviceIdHeader);
        const result = await sessionsService.deActivate({ device_uuid });
        if (result.hasError) {
            return new Responses.BadRequest();
        }
        return new Responses.Ok(result.data);
    }

    @Post(
        Constants.Endpoints.REFRESH_TOKEN,
        validate(DeviceUUIDHeaderValidator, 'headers'),
        validate(RefreshTokenPayload)
    )
    public async refreshToken(req: Request) {
        const { token, refreshToken } = cast<RefreshTokenPayload>(req.body);
        const device_uuid = req.header(ApplicationConstants.deviceIdHeader);
        try {
            const decodedRefreshToken = await tokenService.decodeToken<IRefreshTokenClaim>(refreshToken);
            try {
                await tokenService.decodeToken(token);
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    const session = await sessionsService.getActiveSession({
                        device_uuid,
                        user: decodedRefreshToken.id
                    });

                    if (session.hasError) {
                        return new Responses.BadRequest();
                    }

                    await sessionsService.updateById(session.data.id, { updatedAt: new Date().toISOString() });
                    // TODO: Assign id
                    return new Responses.Ok(new RefreshTokenDto(decodedRefreshToken.id, null));
                }
            }
        } catch (error) {
            await sessionsService.deActivate({ device_uuid });
        }
        return new Responses.BadRequest();
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

async function throwIfNotExist(query: Query<UsersSchema>, message?: string) {
    if (AppUtils.isFalsy(query)) {
        throw new Responses.BadRequest(message);
    }
    const result = await usersService.one(query, { projection: { password: 1 } });
    if (result.hasError) {
        throw new Responses.BadRequest(result.message);
    }
    return result.data;
}

scheduleJob('30 * * * *', async () => {
    const sessions = await sessionsService.getAllActiveSession();
    sessions.data.list.forEach((session) => {
        // if the active session updatedAt is late by 12 that's means that this session is no
        // longer used and should be turned of
        // TODO deActivate useless sessions
    });
});

// TODO: Forget and reset password scenario
// Enter a unique info like partial of profile info page 1
// Security questions page 2
// send an email with generated number to be entered later on in page 3
// Lock the account after 3 times of trying
// send an email to notify the user that the email is changed
