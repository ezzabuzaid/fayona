import { ErrorResponse, NetworkStatus, SuccessResponse, tokenService } from '@core/helpers';
import { Post, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import { AdminRepo } from '@api/admin';
import { usersRepo } from '@api/users';

@Router('portal')
export class PortalRoutes {

    @Post('login/user')
    public async loginUser(req: Request, res: Response) {
        const { username, password } = req.body;
        const entity = await usersRepo.fetchOne({ username });
        if (!!entity) {
            const isPasswordEqual = await entity.comparePassword(password);
            if (isPasswordEqual) {
                const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
                response['token'] = tokenService.generateToken({ id: entity.id });
                return res.status(response.code).json(response);
            }
        }

        throw new ErrorResponse(translate('wrong_credintals'), NetworkStatus.CONFLICT);
    }

    @Post('login/admin')
    public async loginAdmin(req: Request, res: Response) {
        const { username, password } = req.body;
        const entity = await AdminRepo.fetchEntity({ username }).lean();
        if (!!entity) {
            const isPasswordEqual = await entity.comparePassword(password);
            if (isPasswordEqual) {
                const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
                response['token'] = tokenService.generateToken({ id: entity.id });
                return res.status(response.code).json(response);
            }
        }

        throw new ErrorResponse(translate('wrong_credintals'), NetworkStatus.CONFLICT);
    }

}
