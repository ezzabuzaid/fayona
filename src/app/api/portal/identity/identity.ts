import { tokenService, Responses } from '@core/helpers';
import { Logger, AppUtils } from '@core/utils';
import { NextFunction, Request, Response } from 'express';
import { sessionsService } from '@api/sessions/sessions.service';
import { ApplicationConstants } from '@core/constants';
export enum ERoles {
    SUPERADMIN,
    ADMIN,
    CLIENT,
    CUSTOMER,
}
const log = new Logger('Auth Module');

class Identity {

    public Authorize(role: ERoles) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const decodeToken = await this.isAuthenticated(req, res, next);
            if (decodeToken.role === role) {
                next();
            }
            throw new Responses.Unauthorized();
        };
    }

    public async isAuthenticated(req: Request, res: Response, next: NextFunction) {
        log.info('Start verifing JWT');

        const { token, device_uuid } = this.checkParams(req);
        try {
            // STUB test if the request has an `authorization` header with invalid token
            // STUB test if the request has an `authorization` header with expired token
            const decodeToken = await tokenService.decodeToken(token);

            // STUB test if there's no session associated with `deviceIdHeader` header
            // STUB test if the session is not active
            const session = await sessionsService.getActiveSession({ device_uuid });

            if (session.hasError) {
                // NOTE: not active mean that the session was disabled either by admin or the user logged out
                throw new Responses.Unauthorized();
            }
            return decodeToken;
        } catch (error) {
            log.info('JWT verifing faild');
            await sessionsService.deActivate({ device_uuid });
            throw error;
        }
        next();
    }

    private checkParams(req: Request) {
        // STUB test if the request doesn't have a `deviceIdHeader` header
        // STUB test if the request doesn't have an `authorization` header
        // TODO Amend the validate middleware to take custom response so you don't need the checking lines anymore
        const device_uuid = req.header(ApplicationConstants.deviceIdHeader);
        const token = req.headers.authorization;
        if (AppUtils.isFalsy(device_uuid) || AppUtils.isFalsy(token)) {
            // TODO: validate them using `validate` middleware, add parameter to throw custom http response
            throw new Responses.Unauthorized();
        }
        return { token, device_uuid };
    }

}

export const identity = new Identity();
