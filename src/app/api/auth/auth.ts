import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Singelton } from '../../core/utils';

import { Logger } from '../../core/utils/logger.service';
import appService from '../../app.service';
const log = new Logger('Auth Module');

class Auth {
    secretKey: string;
    constructor() {
        appService.reactor()
            .register(data => {
                log.debug(data);
                this.secretKey = process.env.JWT_SECRET_KEY;
            })
    }
    isAuthenticated(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, this.secretKey)
            req['user'] = decodedToken;
            next();
        } catch (error) {
            return new Error();
        }
    }

    generateToken(data) {
        try {
            return jwt.sign(data, this.secretKey)
        } catch (error) {
            return new Error('Cannot generate token');
        }
    }
}
export default new Auth();