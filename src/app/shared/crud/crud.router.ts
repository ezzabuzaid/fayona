import { CrudService } from './crud.service';
import { Post, Put, Delete, Get } from '@lib/methods';
import { Auth } from '@api/portal';
import { Request, Response } from 'express';
import { SuccessResponse, NetworkStatus, ErrorResponse } from '@core/helpers';
import { translate } from '@lib/translation';
import { AppUtils } from '@core/utils';
import { Body } from '@lib/mongoose';

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

    @Delete('', Auth.isAuthenticated)
    public async bulkDelete(req: Request, res: Response) {
        const { ids } = req.body as { ids: string[] };
        this._checkIfIdsIsValid(ids);

        const completion = await this.service.bulkDelete(ids);
        if (AppUtils.not(completion)) {
            throw new ErrorResponse(translate('one_of_entities_not_exist'));
        }

        const response = new SuccessResponse(null);
        res.status(response.code).json(response);
    }

    @Post('', Auth.isAuthenticated)
    public async bulkUpdate(req: Request, res: Response) {
        const { ids } = req.body as { ids: Array<Body<T>> };
        this._checkIfIdsIsValid(ids);

        const completion = await this.service.bulkUpdate(ids);
        if (AppUtils.not(completion)) {
            throw new ErrorResponse(translate('one_of_entities_not_exist'));
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
        let { page, size, ...sort } = req.query;
        page = +page;
        size = +size;
        // TODO: Check that the sort object has the same properties in <T>
        if (size === 0) {
            throw new ErrorResponse(translate('no_size_0'));
        }
        const entites = await this.service.all({}, {}, {
            sort,
            limit: size,
            skip: page * size
        });

        const response = new SuccessResponse(entites);
        response.count = entites.length;
        res.status(response.code).json(response);
    }

    private _checkIfIdsIsValid(ids: any[]) {
        if (AppUtils.not(ids) || AppUtils.not(AppUtils.hasItemWithin(ids))) {
            throw new ErrorResponse(translate('please_provide_valid_list_of_ids'));
        }
    }

}
