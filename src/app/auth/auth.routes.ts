import { Router } from '@lib/core';
import { Request, Response, NextFunction } from 'express';
import { Post } from '@lib/methods';
import HttpStatusCodes = require('http-status-codes');
import { SuccessResponse, ErrorResponse } from '@core/helpers';
import { translate } from '@lib/localization';


import { Logger, AppUtils } from '@core/utils';
import auth from './auth';
import { UsersRepo } from '@api/users/users.repo';
const log = new Logger('Auth Router');

@Router('/')
export class AuthRoutes {

    constructor() { }
    
    @Post('login')
    async login(req: Request, res: Response, next: NextFunction) {

        const { username, password } = req.body;
        const currentUser = await UsersRepo.fetchUser({ username }, '-password');

        if (!!currentUser) {
            const isPasswordEqual = await currentUser.comparePassword(password);
            if (isPasswordEqual) {

                const response = new SuccessResponse(currentUser, translate('register_success'), HttpStatusCodes.OK);
                response['token'] = await auth.generateToken({ id: currentUser.id });

                res.status(response.code).json(response);
                next();
            }
        }

        const response = new ErrorResponse(translate('wrong_credintals'), HttpStatusCodes.CONFLICT);
        res.status(response.code).json(response);

    }

}