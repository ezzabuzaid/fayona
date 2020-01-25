import { Router, Get } from '@lib/methods';
import { CrudRouter } from '@shared/crud';
import { MenusModel, MenusSchema } from './menus.model';
import { Repo } from '@shared/crud/crud.repo';
import { Constants } from '@core/helpers';
import { Request, Response } from 'express';
import { CrudService } from '@shared/crud/crud.service';

@Router(Constants.Endpoints.MENUS)
export class MenusRouter extends CrudRouter<MenusSchema> {
    constructor() {
        super(new CrudService(new Repo(MenusModel)));
    }

    @Get()
    public fetchEntities(req: Request, res: Response) {
        return super.fetchEntities(req, res);
    }

}
