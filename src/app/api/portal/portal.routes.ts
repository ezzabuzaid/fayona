import { ErrorResponse, NetworkStatus, SuccessResponse } from '@core/helpers';
import { Post, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';

import { AdminRepo } from '@api/admin';
import { UsersRepo } from '@api/users';
import { Logger } from '@core/utils';
import { Auth } from './auth';
const log = new Logger('PortalRoutes');

@Router('portal')
export class PortalRoutes {

    @Post('login/user')
    public async loginUser(req: Request, res: Response) {
        const { username, password } = req.body;
        const entity = await UsersRepo.fetchEntity({ username }).lean();
        log.debug('Check if user exist');
        if (!!entity) {
            const isPasswordEqual = await entity.comparePassword(password);
            if (isPasswordEqual) {
                const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
                log.debug('Start generateToken');
                response['token'] = Auth.generateToken({ id: entity.id });
                return res.status(response.code).json(response);
            }
        }

        throw new ErrorResponse(translate('wrong_credintals'), NetworkStatus.CONFLICT);
    }

    @Post('login/admin')
    public async loginAdmin(req: Request, res: Response) {
        const { username, password } = req.body;
        const entity = await AdminRepo.fetchEntity({ username }).lean();
        log.debug('Check if user exist');
        if (!!entity) {
            const isPasswordEqual = await entity.comparePassword(password);
            if (isPasswordEqual) {
                const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
                log.debug('Start generateToken');
                response['token'] = Auth.generateToken({ id: entity.id });
                return res.status(response.code).json(response);
            }
        }

        throw new ErrorResponse(translate('wrong_credintals'), NetworkStatus.CONFLICT);
    }

}
