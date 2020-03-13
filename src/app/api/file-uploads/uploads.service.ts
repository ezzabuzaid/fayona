import { CrudService, Repo } from '@shared/crud';
import { UploadsSchema, UploadsModel } from './uploads.model';

export class UploadsService extends CrudService<UploadsSchema> {
    constructor() {
        super(new Repo(UploadsModel));
    }
}

export default new UploadsService();
