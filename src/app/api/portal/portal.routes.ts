import { ErrorResponse, SuccessResponse, tokenService, Constants, NetworkStatus, IRefreshTokenClaim } from '@core/helpers';
import { Post, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import usersService from '@api/users/users.service';
import { UsersSchema } from '@api/users';
import { Body } from '@lib/mongoose';
import { EmailService, fakeEmail } from '@shared/email';
import { AppUtils } from '@core/utils';
import { PortalHelper } from './portal.helper';
import { TokenExpiredError } from 'jsonwebtoken';
import { Auth } from './auth';
import { ApplicationConstants } from '@core/constants';
import { sessionsService } from '@api/sessions';

export interface ILogin {
    username: string;
    password: string;
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

        const { username, password } = req.body as ILogin;
        const device_uuid = req.header(ApplicationConstants.deviceIdHeader);

        if (AppUtils.not(device_uuid)) {
            throw new ErrorResponse('not_allowed');
        }

        // STUB it should throw if username is falsy type or if it's not in database
        const entity = await throwIfNotExist({ username }, 'wrong_credintals');
        // STUB it should pass if password is right
        const isPasswordEqual = await entity.comparePassword(password);
        if (isPasswordEqual) {

            // STUB it should create a session entity
            await sessionsService.create({
                device_uuid,
                active: true,
                user_id: entity.id
            });

            const response = new SuccessResponse(null);
            // STUB test the refreshToken claims should have only entity id with expire time 12h
            response.refreshToken = PortalHelper.generateRefreshToken(entity.id);
            // STUB test token claims must have only entity id and role with 30min expire time
            response.token = PortalHelper.generateToken(entity.id, entity.role);
            return res.status(response.code).json(response);
        }
        // STUB it should throw if password was wrong
        await throwIfNotExist(null, 'wrong_credintals');
    }

    @Post(Constants.Endpoints.LOGOUT, Auth.isAuthenticated)
    public async logout(req: Request, res: Response) {
        await sessionsService.deActivate({ device_uuid: req.header(ApplicationConstants.deviceIdHeader) });
        const response = new SuccessResponse(null);
        res.status(response.code).json(response);
    }

    @Post(Constants.Endpoints.REFRESH_TOKEN)
    public async refreshToken(req: Request, res: Response) {
        const { token, refreshToken } = req.body as IRefreshTokenBody;
        // NOTE: if it was invalid or expired it will implicity thrown an error
        const decodedRefreshToken = await tokenService.decodeToken<IRefreshTokenClaim>(refreshToken);

        try {
            await tokenService.decodeToken(token);
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                const session = await sessionsService.getActiveSession({
                    device_uuid: req.header(ApplicationConstants.deviceIdHeader),
                    user_id: decodedRefreshToken.id
                });
                if (AppUtils.not(session)) {
                    throw new ErrorResponse(translate('not_authorized'), NetworkStatus.UNAUTHORIZED);
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
        throw new ErrorResponse(translate('not_allowed'), NetworkStatus.NOT_ACCEPTABLE);

    }

    @Post(Constants.Endpoints.FORGET_PASSWORD)
    public async forgotPassword(req: Request, res: Response) {
        const { username } = req.body as Body<UsersSchema>;
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
        const { password } = req.body as Body<UsersSchema>;
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        await usersService.update(decodedToken.id, { password });
        const response = new SuccessResponse(null);
        await EmailService.sendEmail(fakeEmail());
        res.status(response.code).json(response);
    }

    // TODO: the user should verify his email and phonenumber
    @Post(Constants.Endpoints.VERIFY_ACCOUNT)
    public async verify(req: Request, res: Response) {
        const { token } = req.query;
        const decodedToken = await tokenService.decodeToken(token);
        await usersService.update(decodedToken.id, { verified: true });
        const response = new SuccessResponse(null);
        res.status(response.code).json(response);
    }

    @Post(Constants.Endpoints.VERIFY_ACCOUNT, Auth.isAuthenticated)
    public async sendVerificationEmail(req: Request, res: Response) {
        const { token } = req.query;
        const decodedToken = await tokenService.decodeToken(token);
        await usersService.update(decodedToken.id, { verified: true });
        const response = new SuccessResponse(null);
        res.status(response.code).json(response);
    }

}

async function throwIfNotExist(query: Partial<Body<UsersSchema> & { _id: string }>, message = 'not_exist') {
    if (AppUtils.isNullOrUndefined(query)) {
        throw new ErrorResponse(message);
    }
    const entity = await usersService.one(query);
    if (!!entity) {
        return entity;
    }
    throw new ErrorResponse(message);
}

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
