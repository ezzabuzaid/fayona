import { CrudService } from '@shared/crud';
import { SuccessResponse } from '@core/helpers';
import { Request, Response } from 'express';
import { translate } from '@lib/translation';
import { Repo } from '@shared/crud/crud.repo';
import { MealsSchema, MealsModel } from './meals.model';

export class MealsService extends CrudService<MealsSchema> {
    constructor() {
        super(new Repo<MealsSchema>(MealsModel));
    }
    public async fetchAllByMenuId(req: Request, res: Response) {
        const { menu_id } = req.params;
        const entities = await this.repo.fetchAll({ menu_id });
        const response = new SuccessResponse(entities, translate('success'));
        res.status(response.code).json(entities);
    }
}

export default new MealsService();
