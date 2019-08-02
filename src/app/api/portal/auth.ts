import { ErrorResponse, NetworkStatus } from '@core/helpers';
import { Logger } from '@core/utils';
import { tokenService } from '@core/helpers';
import { NextFunction, Request, Response } from 'express';

const log = new Logger('Auth Module');

export class Auth {
    public static async isAuthenticated(req: Request, res: Response, next: NextFunction) {
        log.info('Start verifing JWT');
        const unauth = new ErrorResponse('Not authorized', NetworkStatus.UNAUTHORIZED);
        try {
            const token = req.headers.authorization;
            const decodedToken = await tokenService.decodeToken(token);
            log.info('Start checking JWT');
            if (!decodedToken) {
                throw unauth;
            }
        } catch (error) {
            throw unauth;
        }

        next();
    }
}
