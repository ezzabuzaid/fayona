import { CrudService } from './crud.service';
import { Post, Put, Delete, Get } from '@lib/methods';
import { Auth } from '@api/portal';
import { Request, Response } from 'express';
import { SuccessResponse, NetworkStatus } from '@core/helpers';
import { translate } from '@lib/translation';

export class CrudRouter<T> {
    constructor(
        protected service: CrudService<T>
    ) { }

    @Post('', Auth.isAuthenticated)
    public async create(req: Request, res: Response) {
        const entity = await this.service.create(req.body);
        const response = new SuccessResponse(entity.toJSON(), translate('success'), NetworkStatus.CREATED);
        res.status(response.code).json(response);
    }

    @Put(':id', Auth.isAuthenticated)
    public update(req: Request, res: Response) {
        return this.service.update(req, res);
    }

    @Delete(':id', Auth.isAuthenticated)
    public async delete(req: Request, res: Response) {
        const entity = await this.service.delete({ _id: req.params.id } as any);
        const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get(':id', Auth.isAuthenticated)
    public async fetchEntity(req: Request, res: Response) {
        const entity = await this.service.one({ _id: req.params.id } as any);
        const response = new SuccessResponse(entity, translate('success'));
        res.status(response.code).json(response);
    }

    @Get('', Auth.isAuthenticated)
    public async fetchEntities(req: Request, res: Response) {
        return this.service.all(req, res);
    }
}
