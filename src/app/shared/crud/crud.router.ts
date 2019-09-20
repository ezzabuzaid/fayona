import { CrudService } from './crud.service';
import { Post, Put, Delete, Get } from '@lib/methods';
import { Auth } from '@api/portal';
import { Request, Response } from 'express';

export class CrudRouter<T> {
    constructor(
        protected service: CrudService<T>
    ) { }

    @Post('', Auth.isAuthenticated)
    public create(req: Request, res: Response) {
        return this.service.create(req, res);
    }

    @Put(':id', Auth.isAuthenticated)
    public update(req: Request, res: Response) {
        return this.service.update(req, res);
    }

    @Delete(':id', Auth.isAuthenticated)
    public delete(req: Request, res: Response) {
        return this.service.delete(req, res);
    }

    @Get(':id', Auth.isAuthenticated)
    public async fetchEntity(req: Request, res: Response) {
        return this.service.one(req, res);
    }

    @Get('', Auth.isAuthenticated)
    public async fetchEntities(req: Request, res: Response) {
        return this.service.all(req, res);
    }
}