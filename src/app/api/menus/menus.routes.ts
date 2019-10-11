import { Router, Get } from '@lib/methods';
import { CrudRouter, CrudService } from '@shared/crud';
import { MenusModel, MenusSchema } from './menus.model';
import { Repo } from '@shared/crud/crud.repo';
import { Constants } from '@core/helpers';
import { Request, Response } from 'express';

@Router(Constants.Endpoints.menus)
export class MenusRouter extends CrudRouter<MenusSchema> {
    constructor() {
        super(new CrudService(new Repo<MenusSchema>(MenusModel)));
    }

    @Get()
    public fetchEntities(req: Request, res: Response) {
        return super.fetchEntities(req, res);
    }

}
