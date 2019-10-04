import { Auth } from '@api/portal';
import { ErrorResponse, NetworkStatus, SuccessResponse, tokenService, Constants } from '@core/helpers';
import { Delete, Get, Post, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import { FavoritesRepo } from './favorites.repo';

@Router(Constants.Endpoints.favorites)
export class FavoritesRouter {
    private repo = FavoritesRepo;

    @Post(':type', Auth.isAuthenticated)
    public async create(req: Request, res: Response) {
        const { item_id } = req.body;
        const { type } = req.params;

        // TODO: make an interface for user token
        const decodedToken = await tokenService.decodeToken<any>(req.headers.authorization);
        const result = await this.repo.createEntity({ type, user_id: decodedToken.id, item_id });
        let response;
        if (result.passed) {
            response = new SuccessResponse(result.entity, translate('success'), NetworkStatus.CREATED);
        } else {
            response = new ErrorResponse(result.msg, NetworkStatus.BAD_REQUEST);
        }
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

    @Get(':type', Auth.isAuthenticated)
    public async fetchFavMeals(req: Request, res: Response) {
        const decodedToken = await tokenService.decodeToken<any>(req.headers.authorization);
        const entites = await this.repo.fetchEntities({
            user_id: decodedToken.id,
            type: req.params.type
        }).populate('item');
        const response = new SuccessResponse(entites, translate('success'), NetworkStatus.OK);
        response['count'] = entites.length;
        res.status(response.code).json(response);
    }

}
