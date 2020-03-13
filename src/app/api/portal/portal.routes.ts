import {
    ErrorResponse, SuccessResponse, tokenService, Constants,
    IRefreshTokenClaim, Responses, HashService, sendResponse
} from '@core/helpers';
import { Post, Router } from '@lib/methods';
import { Request, Response } from 'express';
import usersService from '@api/users/users.service';
import { UsersSchema } from '@api/users';
import { Payload } from '@lib/mongoose';
import { EmailService, fakeEmail } from '@shared/email';
import { AppUtils } from '@core/utils';
import { PortalHelper } from './portal.helper';
import { TokenExpiredError } from 'jsonwebtoken';
import { Auth } from './auth';
import { ApplicationConstants } from '@core/constants';
import { sessionsService } from '@api/sessions/sessions.service';
import { IsString } from 'class-validator';
import { translate } from '@lib/translation';
import { scheduleJob } from 'node-schedule';

export class LoginPayload {
    @IsString({
        message: translate('string_constraint', { name: 'username' })
    }) public username: string = null;

    @IsString({
        message: translate('string_constraint', { name: 'password' })
    }) public password: string = null;

    constructor(payload: LoginPayload) {
        AppUtils.strictAssign(this, payload);
    }
}

export interface IRefreshTokenBody {
    token: string;
    refreshToken: string;
}

@Router(Constants.Endpoints.PORTAL)
export class PortalRoutes {

    @Post(Constants.Endpoints.LOGIN)
    public async login(req: Request, res: Response) {
        // TODO: send an email to user to notify him about login attempt.

        const { username, password } = new LoginPayload(req.body);
        const device_uuid = req.header(ApplicationConstants.deviceIdHeader);

        if (AppUtils.isFalsy(device_uuid)) {
            throw new Responses.Unauthorized();
        }

        // STUB it should throw if username is falsy type or if it's not in database
        const record = await throwIfNotExist({ username }, 'wrong_credintals');

        const activeUserSessions = await sessionsService.getActiveUserSession(record.id);

        if (activeUserSessions.length >= 3) {
            throw new Responses.Unauthorized('exceed_allowed_sesison');
        }

        // STUB it should pass if password is right
        const isPasswordEqual = HashService.comparePassword(password, record.password);
        if (AppUtils.isFalsy(isPasswordEqual)) {
            throw new Responses.BadRequest('wrong_credintals');
        } else {
            // STUB it should create a session entity
            const session = await sessionsService.create({
                device_uuid,
                active: true,
                user_id: record.id
            });

            const response = new SuccessResponse(null);
            response.session_id = session.data.id;
            // STUB test the refreshToken claims should have only entity id with expire time 12h
            response.refreshToken = PortalHelper.generateRefreshToken(record.id);
            // STUB test token claims must have only entity id and role with 30min expire time
            response.token = PortalHelper.generateToken(record.id, record.role);
            res.status(response.code).json(response);
        }
    }

    @Post(Constants.Endpoints.LOGOUT)
    public async logout(req: Request, res: Response) {
        const device_uuid = req.body[ApplicationConstants.deviceIdHeader];
        if (device_uuid) {
            const result = await sessionsService.deActivate({ device_uuid });
            if (AppUtils.not(result.hasError)) {
                sendResponse(res, new Responses.Ok(result.data));
                return;
            }
        }
        sendResponse(res, new Responses.BadRequest('logout_wrong_device_uuid'));
    }

    @Post(Constants.Endpoints.REFRESH_TOKEN)
    public async refreshToken(req: Request, res: Response) {
        const { token, refreshToken } = req.body as IRefreshTokenBody;
        // NOTE: if it was invalid or expired it will implicity thrown an error
        const decodedRefreshToken = await tokenService.decodeToken<IRefreshTokenClaim>(refreshToken);

        const device_uuid = req.header(ApplicationConstants.deviceIdHeader);

        if (AppUtils.isFalsy(device_uuid)) {
            throw new Responses.Unauthorized();
        }

        try {
            await tokenService.decodeToken(token);
        } catch (error) {
            if (error instanceof TokenExpiredError) {

                const session = await sessionsService.getActiveSession({
                    device_uuid,
                    user_id: decodedRefreshToken.id
                });
                if (AppUtils.isFalsy(session)) {
                    throw new Responses.Unauthorized();
                }

                const user = await throwIfNotExist({ _id: decodedRefreshToken.id });
                const response = new SuccessResponse<IRefreshTokenBody>({
                    token: PortalHelper.generateToken(user.id, user.role),
                    refreshToken
                });
                return res.status(response.code).json(response);
            } else {
                throw error;
            }
        }
        throw new ErrorResponse('not_allowed');
    }

    @Post(Constants.Endpoints.FORGET_PASSWORD)
    public async forgotPassword(req: Request, res: Response) {
        const { username } = req.body as Payload<UsersSchema>;
        const entity = await throwIfNotExist({ username }, 'Error sending the password reset message. Please try again shortly.');
        const token = tokenService.generateToken({ id: entity.id, role: entity.role }, { expiresIn: '1h' });
        await EmailService.sendEmail(fakeEmail(token));
        const response = new SuccessResponse('An e-mail has been sent to ${user.email} with further instructions');
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
        const response = new SuccessResponse(null);
        await EmailService.sendEmail(fakeEmail());
        res.status(response.code).json(response);
    }

    // TODO: the user should verify his email and phonenumber
    @Post(Constants.Endpoints.VERIFY_ACCOUNT)
    public async verify(req: Request, res: Response) {
        const { token } = req.query;
        const decodedToken = await tokenService.decodeToken(token);
        await usersService.updateById(decodedToken.id, { verified: true });
        const response = new SuccessResponse(null);
        res.status(response.code).json(response);
    }

    @Post(Constants.Endpoints.VERIFY_ACCOUNT, Auth.isAuthenticated)
    public async sendVerificationEmail(req: Request, res: Response) {
        const { token } = req.query;
        const decodedToken = await tokenService.decodeToken(token);
        await usersService.updateById(decodedToken.id, { verified: true });
        const response = new SuccessResponse(null);
        res.status(response.code).json(response);
    }

}

async function throwIfNotExist(query: Partial<Payload<UsersSchema> & { _id: string }>, message = 'not_exist') {
    if (AppUtils.isFalsy(query)) {
        throw new ErrorResponse(message);
    }
    const entity = await usersService.one(query, { password: 1 });
    if (!!entity) {
        return entity;
    }
    throw new ErrorResponse(message);
}

scheduleJob('30 * * * *', async () => {
    const sessions = await sessionsService.getAllActiveSession();
    sessions.forEach((session) => {
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
