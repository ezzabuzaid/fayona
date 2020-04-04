import { CrudService, Repo } from '@shared/crud';
import { FoldersSchema, FoldersModel } from './folders.model';
import { UploadsHelper } from './uploads.helper';

export class FoldersService extends CrudService<FoldersSchema> {
    _user = null;
    get user() {
        return this._user;
    }
    set user(value) {
        this._user = value;
    }

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
        // this.repo.model.find({
        //     owners: {
        //         $elemMatch: id
        //     }
        // });

        // this.repo.model.find({
        //     owners: {
        //         $in: [id]
        //     }
        // });
    }
}

export default new FoldersService();
