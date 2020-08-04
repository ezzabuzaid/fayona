import { CrudService, CrudDao } from '@shared/crud';
import { ActivitesSchema } from './activities.model';
import { locateModel } from '@lib/mongoose';

export class ActivitesService extends CrudService<ActivitesSchema> {

    constructor() {
        super(new CrudDao(ActivitesSchema));
    }

}

export default new ActivitesService();
