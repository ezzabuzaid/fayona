import { CrudService, Repo } from '@shared/crud';
import { ActivitesSchema } from './activities.model';
import { locateModel } from '@lib/mongoose';

export class ActivitesService extends CrudService<ActivitesSchema> {

    constructor() {
        super(new Repo(ActivitesSchema));
    }

}

export default new ActivitesService();
