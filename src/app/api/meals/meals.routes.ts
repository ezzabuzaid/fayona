import { Constants } from '@core/helpers';
import { Get, Router } from '@lib/methods';
import { Request, Response } from 'express';
import mealsService from './meals.service';
import { CrudRouter } from '@shared/crud';
import { MealsSchema } from './meals.model';

@Router(Constants.Endpoints.MEALS)
export class MealsRouter extends CrudRouter<MealsSchema> {
    constructor() {
        super(mealsService);
    }
    @Get('menu/:menu_id')
    public async fetchEntitiesByMealID(req: Request, res: Response) {
        return mealsService.fetchAllByMenuId(req, res);
    }
}
