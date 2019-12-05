import { ErrorResponse, SuccessResponse, tokenService, Constants, NetworkStatus } from '@core/helpers';
import { Post, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import usersService from '@api/users/users.service';
import { UsersSchema } from '@api/users';
import { Body } from '@lib/mongoose';
import { EmailService } from '@shared/email';
import { AppUtils } from '@core/utils';
import { PortalHelper } from './portal.helper';

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
        await tokenService.decodeToken(refreshToken);

        const decodedToken = await tokenService.decodeToken(token);
        // TODO: find a way to know that the token is really for this user (unique device id) generate one in
        // login and save it in browser
        if (AppUtils.not(tokenService.isTokenExpired(decodedToken))) {
            throw new ErrorResponse(translate('not_allowed'), NetworkStatus.NOT_ACCEPTABLE);
        }
        await throwIfNotExist({ _id: decodedToken.id });
        const response = new SuccessResponse<IRefreshTokenBody>({
            token: PortalHelper.generateToken(decodedToken.id, decodedToken.role),
            refreshToken: PortalHelper.generateRefreshToken(decodedToken.id)
        });
        return res.status(response.code).json(response);
    }

    @Post(Constants.Endpoints.FORGET_PASSWORD)
    public async forgotPassword(req: Request, res: Response) {
        const { email } = req.body as Body<UsersSchema>;
        const entity = await throwIfNotExist({ email });
        const token = tokenService.generateToken({ id: entity.id, role: entity.role }, { expiresIn: '1h' });
        const message = {
            from: 'ezzabuzaid@gmail.com',
            to: 'ezzabuzaid@hotmail.com',
            subject: 'Nodemailer is unicode friendly ✔',
            text: 'Hello to myself!',
            html: `Click on this link to complete <a href="${token}">Reset Password</>`
        };
        const url = await EmailService.sendEmail(message);
        const response = new SuccessResponse({ url });
        res.status(response.code).json(response);
    }

    @Post(Constants.Endpoints.RESET_PASSWORD)
    public async resetPassword(req: Request, res: Response) {
        const { password } = req.body as Body<UsersSchema>;
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        await usersService.update({ id: decodedToken.id, body: { password } });
        const response = new SuccessResponse(null);
        const message = {
            from: 'ezzabuzaid@gmail.com',
            to: 'ezzabuzaid@hotmail.com',
            subject: 'Nodemailer is unicode friendly ✔',
            text: 'Hello to myself!',
            html: `Password rest successfully`
        };
        await EmailService.sendEmail(message);
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
