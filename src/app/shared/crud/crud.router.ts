import { CrudService } from './crud.service';
import { Post, Put, Delete, Get } from '@lib/methods';
import { Auth } from '@api/portal';
import { Request, Response } from 'express';
import { SuccessResponse, NetworkStatus, ErrorResponse } from '@core/helpers';
import { translate } from '@lib/translation';

export class CrudRouter<T> {
    constructor(
        protected service: CrudService<T>
    ) { }

    @Post('', Auth.isAuthenticated)
    public async create(req: Request, res: Response) {
        const result = await this.service.create(req.body);
        if (result.exist) {
            throw new ErrorResponse(translate('entity_exist'));
        }
        const response = new SuccessResponse(result.entity, translate('success'), NetworkStatus.CREATED);
        res.status(response.code).json(response);
    }

    @Put(':id', Auth.isAuthenticated)
    public async update(req: Request, res: Response) {
        const entity = await this.service.update({ body: req.body, id: req.params.id });
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'));
        }
        const response = new SuccessResponse(null);
        res.status(response.code).json(response);
    }

    @Delete(':id', Auth.isAuthenticated)
    public async delete(req: Request, res: Response) {
        const entity = await this.service.delete({ _id: req.params.id } as any);
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'));
        }
        const response = new SuccessResponse(null);
        res.status(response.code).json(response);
    }

    @Get(':id', Auth.isAuthenticated)
    public async fetchEntity(req: Request, res: Response) {
        const entity = await this.service.one({ _id: req.params.id } as any);
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'));
        }
        const response = new SuccessResponse(entity);
        res.status(response.code).json(response);
    }

    @Get('', Auth.isAuthenticated)
    public async fetchEntities(req: Request, res: Response) {
        const entites = await this.service.all();
        const response = new SuccessResponse(entites);
        response.count = entites.length;
        res.status(response.code).json(response);
    }
}
