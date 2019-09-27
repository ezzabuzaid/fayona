import { Auth } from '@api/portal';
import { SuccessResponse, Constants } from '@core/helpers';
import { Get, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import { CrudRouter } from '@shared/crud';
import { AccountSchema } from './accounts.model';
import accountsService from './accounts.service';

@Router(Constants.Endpoints.Account)
export class AccountRouter extends CrudRouter<AccountSchema> {
    constructor() {
        super(accountsService);
    }

    @Get(':user_id', Auth.isAuthenticated)
    public async getEntityByUserId(req: Request, res: Response) {
        const entity = await accountsService.getEntityByUserId(req.body.user_id);
        const response = new SuccessResponse(entity, translate('success'));
        res.status(response.code).json(response);
    }
}
