import { Router } from '@lib/methods';
import { Request, Response } from 'express';
import { Post } from '@lib/methods';
import { SuccessResponse, ErrorResponse, NetworkStatus } from '@core/helpers';
import { translate } from '@lib/localization';


import { Logger } from '@core/utils';
import { UsersRepo } from '@api/users';
import { Auth } from './auth';
const log = new Logger('Auth Router');

@Router('portal')
export class AuthRoutes {

    constructor() { }

    @Post('login')
    async login(req: Request, res: Response) {
        const { username, password } = req.body;
        const user = await UsersRepo.fetchEntity({ username });
        log.debug('Check if user exist');
        if (!!user) {
            const isPasswordEqual = await user.comparePassword(password);
            if (isPasswordEqual) {
                const response = new SuccessResponse(user, translate('register_success'), NetworkStatus.OK);
                log.debug('Start generateToken');
                response['token'] = Auth.generateToken({ id: user.id });
                return res.status(response.code).json(response);
            }
        }

        throw new ErrorResponse(translate('wrong_credintals'), NetworkStatus.CONFLICT);
    }

}