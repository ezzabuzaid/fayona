import { CrudService, Repo } from '@shared/crud';
import activitiesModel, { ActivitesSchema } from './activities.model';

export class ActivitesService extends CrudService<ActivitesSchema> {

    constructor() {
        super(new Repo(activitiesModel));
    }

}

export default new ActivitesService();
