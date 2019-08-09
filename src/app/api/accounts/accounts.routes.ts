import { Auth } from '@api/portal';
import { ErrorResponse, NetworkStatus, SuccessResponse, tokenService } from '@core/helpers';
import { Logger } from '@core/utils';
import { Delete, Get, Post, Put, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import { AccountRepo } from './accounts.repo';
import { Constants } from '@core/helpers';
const log = new Logger('AccountRouter');

@Router(Constants.Endpoints.Account)
export class AccountRouter {
    private repo = AccountRepo;



    @Put(':id', Auth.isAuthenticated)
    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const { address, firstName, image, lastName } = req.body;
        const decodedToken = await tokenService.decodeToken<any>(req.headers.authorization);
        const entity = await this.repo.updateEntity(id, { address, firstName, image, lastName, user_id: decodedToken.id });
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Delete(':id', Auth.isAuthenticated)
    public async delete(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await this.repo.deleteEntity(id);
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get(':user_id', Auth.isAuthenticated)
    public async fetchEntity(req: Request, res: Response) {
        const { user_id } = req.params;
        const entity = await this.repo.fetchEntity({ user_id }).populate('user').lean();
        // const result = { ...entity, ...entity.user_id };
        // delete result.user_id;
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const response = new SuccessResponse(entity, translate('success'));
        res.status(response.code).json(response);
    }

    @Get()
    public async fetchEntities(req: Request, res: Response) {
        const entites = await this.repo.fetchEntities();
        const response = new SuccessResponse(entites, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }
}

