import { Responses, Result } from '@core/helpers';
import { Logger, AppUtils } from '@core/utils';
import { NextFunction, Request, Response } from 'express';
import { sessionsService } from '@api/sessions/sessions.service';
import { ApplicationConstants } from '@core/constants';
import { tokenService, ITokenClaim } from './token';
export enum ERoles {
    SUPERADMIN,
    ADMIN,
    CLIENT,
    CUSTOMER,
}
const log = new Logger('Auth Module');

class Identity {

    public Authorize(...roles: ERoles[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const { token, device_uuid } = this.extractToken(req);
            const result = await this.verifyUserSession(token, device_uuid);
            if (AppUtils.not(result.hasError) && roles.includes(result.data.role)) {
                return next();
            }
            return new Responses.Forbidden();
        };
    }

    public isAuthenticated() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const { token, device_uuid } = this.extractToken(req);
            const result = await this.verifyUserSession(token, device_uuid);
            if (result.hasError) {
                return new Responses.Unauthorized();
            }
            next();
        };
    }

    extractToken(req: Request) {
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

    async verifyUserSession(token: string, device_uuid: string) {
        // STUB test if the request has an `authorization` header with invalid token
        // STUB test if the request has an `authorization` header with expired token
        const decodeToken = await tokenService.decodeToken(token);

        // STUB test if there's no session associated with `deviceIdHeader` header
        // STUB test if the session is not active
        const session = await sessionsService.getActiveSession({ device_uuid });

        if (session.hasError) {
            // NOTE: not active mean that the session was disabled either by admin or the user logged out
            return new Result<ITokenClaim>({ hasError: true });
        }

        return new Result<ITokenClaim>({ data: decodeToken });
    }

}

export const identity = new Identity();
