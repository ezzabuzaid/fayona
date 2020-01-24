import { tokenService } from '@core/helpers';
import { Logger } from '@core/utils';
import { NextFunction, Request, Response } from 'express';
import { sessionsService } from '@api/sessions';
import { ApplicationConstants } from '@core/constants';

const log = new Logger('Auth Module');

export class Auth {
    public static async isAuthenticated(req: Request, res: Response, next: NextFunction) {
        log.info('Start verifing JWT');
        try {
            log.info('Start checking JWT');
            await tokenService.decodeToken(req.headers.authorization);
        } catch (error) {
            await sessionsService.deActivate(req.header(ApplicationConstants.deviceIdHeader));
            throw error;
        }
        next();
    }
}
