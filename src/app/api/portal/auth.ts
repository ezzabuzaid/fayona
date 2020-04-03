import { tokenService, Responses } from '@core/helpers';
import { Logger, AppUtils } from '@core/utils';
import { NextFunction, Request, Response } from 'express';
import { sessionsService } from '@api/sessions/sessions.service';
import { ApplicationConstants } from '@core/constants';

const log = new Logger('Auth Module');

export class Auth {
    public static async isAuthenticated(req: Request, res: Response, next: NextFunction) {
        log.info('Start verifing JWT');

        // STUB test if the request doesn't have a `deviceIdHeader` header
        // STUB test if the request doesn't have an `authorization` header
        const device_uuid = req.header(ApplicationConstants.deviceIdHeader);
        const token = req.header(ApplicationConstants.authorization);
        if (AppUtils.isFalsy(device_uuid) || AppUtils.isFalsy(token)) {
            return new Responses.Unauthorized();
        }

        try {
            // STUB test if the request doesn't have an `authorization` header
            // STUB test if the request has an `authorization` header with invalid token
            // STUB test if the request has an `authorization` header with expired token
            await tokenService.decodeToken(token);

            // STUB test if there's no session associated with `deviceIdHeader` header
            // STUB test if the session is not active
            const session = await sessionsService.getActiveSession({ device_uuid });

            if (AppUtils.isFalsy(session.hasError)) {
                // NOTE: not active mean that the session was disabled either by admin or the user logged out
                return new Responses.Unauthorized();
            }
        } catch (error) {
            log.info('JWT verifing faild');
            await sessionsService.deActivate({ device_uuid });
            return new Responses.Unauthorized();
        }
        next();
    }
}
