import { CrudService } from '@shared/crud';
import { MealsSchema } from './meals.model';
import { mealsModel } from '.';
import { SuccessResponse } from '@core/helpers';
import { Request, Response } from 'express';
import { translate } from '@lib/translation';

export class MealsService extends CrudService<MealsSchema> {
    constructor() {
        super(mealsModel);
    }
    public async fetchAllByMenuId(req: Request, res: Response) {
        const { menu_id } = req.params;
        const entities = await this.repo.fetchAll({ menu_id });
        const response = new SuccessResponse(entities, translate('success'));
        res.status(response.code).json(entities);
    }
}

export default new MealsService();
