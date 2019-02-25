import { Router } from '@lib/core';
import { Request, Response, NextFunction } from 'express';
import { Post } from '@lib/methods';
import { SuccessResponse, ErrorResponse, NetworkStatus } from '@core/helpers';
import { translate } from '@lib/localization';


import { Logger, AppUtils } from '@core/utils';
import { UsersRepo } from '@api/users';
import { Auth } from './auth';
const log = new Logger('Auth Router');

@Router('/')
export class AuthRoutes {

    constructor() { }

    @Post('login')
    async login(req: Request, res: Response, next: NextFunction) {

        const { username, password } = req.body;
        const currentUser = await UsersRepo.fetchUser({ username });
        log.debug('Check if user exist');
        if (!!currentUser) {
            const isPasswordEqual = await currentUser.comparePassword(password);
            if (isPasswordEqual) {
                const userWithoutPassword = AppUtils.removeKey('password', currentUser.toObject());
                const response = new SuccessResponse(userWithoutPassword, translate('register_success'), NetworkStatus.OK);
                log.debug('Start generateToken');
                response['token'] = Auth.generateToken({ id: currentUser.id });
                return res.status(response.code).json(response);
            }
        }

        throw new ErrorResponse(translate('wrong_credintals'), NetworkStatus.CONFLICT);
    }

}