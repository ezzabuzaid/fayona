import { Request, Response, NextFunction } from 'express';
import { Logger } from '@core/utils';
import { ErrorResponse, NetworkStatus } from '@core/helpers';
import jwt = require('jsonwebtoken');

const log = new Logger('Auth Module');

export class Auth {
    static async isAuthenticated(req: Request, res: Response, next: NextFunction) {
        log.info('Start verifing JWT')
        const unauth = new ErrorResponse('Not authorized', NetworkStatus.UNAUTHORIZED);
        try {
            const token = req.headers.authorization;
            const decodedToken = await verify(token);
            log.info('Start checking JWT')
            if (!decodedToken) {
                throw unauth;
            }
        } catch (error) {
            throw unauth;
        }

        next();
    }
    /**
     * 
     * @param data token payload
     * @returns the encrypted token
     */
    static generateToken(data) {
        return jwt.sign(data, process.env.JWT_SECRET_KEY);
    }
}

function verify(token: string) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decodedToken) {
            if (err) { reject(err); }
            resolve(decodedToken);
        });
    });
}