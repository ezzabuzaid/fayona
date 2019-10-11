import { ErrorResponse, NetworkStatus, SuccessResponse, tokenService, Constants } from '@core/helpers';
import { Post, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import usersService from '@api/users/users.service';

// TODO: create the profile / acount strategy

@Router(Constants.Endpoints.PORTAL)
export class PortalRoutes {

    @Post(`login/${Constants.Endpoints.USERS}`)
    public async loginUser(req: Request, res: Response) {
        const { username, password } = req.body;
        const entity = await usersService.one({ username });
        if (!!entity) {
            const isPasswordEqual = await entity.comparePassword(password);
            if (isPasswordEqual) {
                const response = new SuccessResponse(entity, translate('success'));
                response.token = tokenService.generateToken({ id: entity.id });
                return res.status(response.code).json(response);
            }
        }
        throw new ErrorResponse(translate('wrong_credintals'));
    }

}
