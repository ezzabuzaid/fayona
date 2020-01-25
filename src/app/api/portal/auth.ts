import { tokenService, ErrorResponse, NetworkStatus } from '@core/helpers';
import { Logger, AppUtils } from '@core/utils';
import { NextFunction, Request, Response } from 'express';
import { sessionsService } from '@api/sessions/sessions.service';
import { ApplicationConstants } from '@core/constants';

const log = new Logger('Auth Module');

export class Auth {
    public static async isAuthenticated(req: Request, res: Response, next: NextFunction) {
        log.info('Start verifing JWT');
        try {
            log.info('Start checking JWT');
            await tokenService.decodeToken(req.headers.authorization);
            const session = await sessionsService.getActiveSession({
                device_uuid: req.header(ApplicationConstants.deviceIdHeader)
            });
            if (AppUtils.isNullOrUndefined(session) || AppUtils.not(session.active)) {
                throw new ErrorResponse('not_authorized', NetworkStatus.UNAUTHORIZED);
            }
        } catch (error) {
            await sessionsService.deActivate({ device_uuid: req.header(ApplicationConstants.deviceIdHeader) });
            throw error;
        }
        next();
    }
}
