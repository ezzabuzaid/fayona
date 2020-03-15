import { CrudService, Repo } from '@shared/crud';
import { FoldersSchema, FoldersModel } from './folders.model';

export class FoldersService extends CrudService<FoldersSchema> {
    constructor() {
        super(new Repo(FoldersModel));
    }
}

export default new FoldersService();
