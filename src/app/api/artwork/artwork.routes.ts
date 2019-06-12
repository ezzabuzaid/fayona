import { Auth } from '@api/portal';
import { ErrorResponse, NetworkStatus, SuccessResponse } from '@core/helpers';
import { Delete, Get, Post, Put, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import { ArtworksRepo } from './artwork.repo';

@Router('artworks')
export class ArtworksRouter {
    private repo = ArtworksRepo;

    @Post('', Auth.isAuthenticated)
    public async create(req: Request, res: Response) {
        const { name, status, image } = req.body;
        const user = await this.repo.createEntity({ name, status, image });
        const response = new SuccessResponse(user, translate('success'), NetworkStatus.CREATED);
        res.status(response.code).json(response);
    }

    @Put(':id', Auth.isAuthenticated)
    public async update(req: Request, res: Response) {
        const { id } = req.params;

        const entity = await this.repo.fetchEntityById(id).lean();

        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }

        const { name, status, image } = req.body;
        entity.set({ name, status, image });
        await entity.save();

        const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Delete(':id', Auth.isAuthenticated)
    public async delete(req: Request, res: Response) {

        const { id } = req.params;
        const entity = await this.repo.deleteEntity(id);
        console.log('entity => ', entity);
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }

        const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get(':id', Auth.isAuthenticated)
    public async fetchEntity(req: Request, res: Response) {

        const { id } = req.params;
        const entity = await this.repo.fetchEntityById(id).lean();

        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }

        const response = new SuccessResponse(entity, translate('success'));
        res.status(response.code).json(response);
    }

    @Get()
    public async fetchEntities(req: Request, res: Response) {

        const admins = await this.repo.fetchEntities();

        const response = new SuccessResponse(admins, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

}
