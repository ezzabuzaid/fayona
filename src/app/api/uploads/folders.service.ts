import { CrudService, Repo } from '@shared/crud';
import { FoldersSchema, FoldersModel } from './folders.model';
import { UploadsHelper } from './uploads.helper';

export class FoldersService extends CrudService<FoldersSchema> {
    constructor() {
        super(new Repo(FoldersModel), {
            create: {
                post(folder) {
                    UploadsHelper.createFolderDirectory(folder.id);
                }
            },
            delete: {
                post(folder) {
                    UploadsHelper.removeFolder(folder.id);
                }
            }
        });
    }
}

export default new FoldersService();
