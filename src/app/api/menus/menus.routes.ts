import { Router } from '@lib/methods';
import { CrudRouter, CrudService } from '@shared/crud';
import { MenusModel, MenusSchema } from './menus.model';
import { Repo } from '@shared/crud/crud.repo';
import { Constants } from '@core/helpers';

@Router(Constants.Endpoints.menus)
export class MenusRouter extends CrudRouter<MenusSchema> {
    constructor() {
        super(new CrudService(new Repo(MenusModel)));
    }
}
