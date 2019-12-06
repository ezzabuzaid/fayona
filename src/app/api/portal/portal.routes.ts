import { ErrorResponse, SuccessResponse, tokenService, Constants, NetworkStatus } from '@core/helpers';
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

export interface IRefreshTokenBody {
    token: string;
    refreshToken: string;
}

@Router(Constants.Endpoints.PORTAL)
export class PortalRoutes {

    @Post(Constants.Endpoints.LOGIN)
    public async login(req: Request, res: Response) {
        // TODO: save the user device, so the next time when he logged from another time you'll notify him
        const { username, password } = req.body as Body<UsersSchema>;
        const entity = await throwIfNotExist({ username }, 'wrong_credintals');
        const isPasswordEqual = await entity.comparePassword(password);
        if (isPasswordEqual) {
            // TODO: replace the response with login response and not user info
            // TODO: save the device id in token so when the user request refresh token,
            // we can now that the request coming from the right user
            const response = new SuccessResponse(entity);
            response.refreshToken = PortalHelper.generateRefreshToken(entity.id);
            response.token = PortalHelper.generateToken(entity.id, entity.role);
            return res.status(response.code).json(response);
        }
        await throwIfNotExist(null, 'wrong_credintals');
    }

    @Post(Constants.Endpoints.REFRESH_TOKEN)
    public async refreshToken(req: Request, res: Response) {
        // REVIEW bad practice, anyone can get the tokens and request for another access
        // token which is wrong in terms of authorization
        // so the solution is to sessionize the user in the server in a way that all the
        // other instances will now it, (new column in users collection)
        const { token, refreshToken } = req.body as IRefreshTokenBody;
        // NOTE: if it's not valid it will implicity thrown an error
        const decodedRefreshToken = await tokenService.decodeToken(refreshToken);

        try {
            await tokenService.decodeToken(token);
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                // TODO: find a way to know that the token is really for this user (unique device id) generate one in
                // login and save it in browser
                const user = await throwIfNotExist({ _id: decodedRefreshToken.id });
                // TODO: invalidate the refresh token directly after new one is generated
                const response = new SuccessResponse<IRefreshTokenBody>({
                    token: PortalHelper.generateToken(user.id, user.role),
                    refreshToken: PortalHelper.generateRefreshToken(user.id)
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
        const { email } = req.body as Body<UsersSchema>;
        const entity = await throwIfNotExist({ email });
        const token = tokenService.generateToken({ id: entity.id, role: entity.role }, { expiresIn: '1h' });
        const url = await EmailService.sendEmail(fakeEmail());
        const response = new SuccessResponse({ url });
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
        await usersService.update({ id: decodedToken.id, body: { password } });
        const response = new SuccessResponse(null);
        await EmailService.sendEmail(fakeEmail());
        res.status(response.code).json(response);
    }

    // TODO: the user should verify his email and phonenumber
    @Post(Constants.Endpoints.VERIFY_ACCOUNT)
    public async verify(req: Request, res: Response) {
        const { token } = req.query;
        const decodedToken = await tokenService.decodeToken(token);
        await usersService.update({ id: decodedToken.id, body: { verified: true } });
        const response = new SuccessResponse(null);
        res.status(response.code).json(response);
    }

    @Post(Constants.Endpoints.VERIFY_ACCOUNT, Auth.isAuthenticated)
    public async sendVerificationEmail(req: Request, res: Response) {
        const { token } = req.query;
        const decodedToken = await tokenService.decodeToken(token);
        await usersService.update({ id: decodedToken.id, body: { verified: true } });
        const response = new SuccessResponse(null);
        res.status(response.code).json(response);
    }

}

async function throwIfNotExist(query: Partial<Body<UsersSchema> & { _id: string }>, message = 'not_exist') {
    if (AppUtils.isNullOrUndefined(query)) {
        throw new ErrorResponse(translate(message));
    }
    const entity = await usersService.one(query);
    if (!!entity) {
        return entity;
    }
    throw new ErrorResponse(translate(message));
}

// TODO: Forget and reset password scenario
// Enter a unique info like partial of profile info page 1
// Security questions page 2
// send an email with generated number to be entered later on in page 3
// Lock the account after 3 times of trying
// send an email to notify the user that the email is changed
