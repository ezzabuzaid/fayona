import { Responses, Result } from '@core/response';
import { Logger, AppUtils } from '@core/utils';
import { NextFunction, Request, Response } from 'express';
import { tokenService, ITokenClaim } from './token';
import { locate } from '@lib/locator';
import { SessionsService } from '@api/sessions/sessions.service';
import { Constants } from '@core/constants';
export class Roles {
    static SUPERADMIN = 'SUPERADMIN';
    static ADMIN = 'ADMIN';
    static CLIENT = 'CLIENT';
    static CUSTOMER = 'CUSTOMER';
}

const log = new Logger('Auth Module');

class Identity {

    public Authorize(...roles: Roles[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const headersResult = this.extractToken(req);
            if (headersResult.hasError) {
                return new Responses.Unauthorized();
            }
            try {
                const result = await this.verifyUserSession(headersResult.data.token, headersResult.data.device_uuid);
                if (AppUtils.isEmpty(roles) || roles.includes(result.data.role)) {
                    return next();
                } else {
                    return new Responses.Forbidden();
                }
            } catch (error) {
                return new Responses.Unauthorized();
            }
        };
    }

    extractToken(req: Request) {
        // STUB test if the request doesn't have a `deviceIdHeader` header
        // STUB test if the request doesn't have an `authorization` header
        // TODO Amend the validate middleware to take custom response so you don't need the checking lines anymore
        // Read about the context option
        const device_uuid = req.header(Constants.Application.deviceIdHeader);
        const token = req.headers.authorization;
        if (AppUtils.isFalsy(device_uuid) || AppUtils.isFalsy(token)) {
            // TODO: validate them using `validate` middleware, add parameter to throw custom http response
            return new Result<{ token: string, device_uuid: string }>({ hasError: true, throwIfError: false });
        }
        return new Result<{ token: string, device_uuid: string }>({ data: { token, device_uuid } });
    }

    async verifyUserSession(token: string, device_uuid: string) {
        // STUB test if the request has an `authorization` header with invalid token
        // STUB test if the request has an `authorization` header with expired token
        const decodeToken = await tokenService.decodeToken(token);

        // STUB test if there's no session associated with `deviceIdHeader` header
        // STUB test if the session is not active
        const session = await locate(SessionsService).getActiveSession({ device_uuid });
        if (session.hasError) {
            // NOTE: not active mean that the session was disabled either by admin or the user logged out
            return new Result<ITokenClaim>({ hasError: true, throwIfError: false });
        }

        return new Result<ITokenClaim>({ data: decodeToken });
    }

}

export const identity = new Identity();
