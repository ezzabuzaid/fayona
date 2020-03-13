import { CrudService, Repo } from '@shared/crud';
import { ActivitesSchema, ActivitesModel } from './activities.model';

export class ActivitesService extends CrudService<ActivitesSchema> {

    constructor() {
        super(new Repo(ActivitesModel));
    }

}

export default new ActivitesService();
