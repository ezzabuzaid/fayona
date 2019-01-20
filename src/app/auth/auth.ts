import { Request, Response, NextFunction } from 'express';
import { Logger } from '@core/utils';
import jwt = require('jsonwebtoken');
import appService from '@core/app.service';

const log = new Logger('Auth Module');

class Auth {
    secretKey: string;
    constructor() {
        /**
         * Wait for app to be init and then set the secretKey
         * the secret key here is getten from the enviornment
         */
        appService.reactor()
            .register(data => {
                log.debug(data);
                this.secretKey = process.env.JWT_SECRET_KEY;
            })
    }
    /**
     * function that determine if the token is allowed
     */
    isAuthenticated(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, this.secretKey)
            req['user'] = decodedToken;
            next();
        } catch (error) {
            throw new Error('Not authorized');
        }
    }
    /**
     * 
     * @param data token payload
     * @returns the encrypted token
     */
    async generateToken(data) {
        data = JSON.stringify(data);
        const sign = () => new Promise((resolve) => resolve(jwt.sign(data, this.secretKey)));
        try {
            return await sign();
        } catch (error) {
            throw new Error('Cannot generate token');
        }
    }
}
export default new Auth();