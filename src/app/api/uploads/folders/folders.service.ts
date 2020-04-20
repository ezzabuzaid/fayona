import { CrudService, Repo } from '@shared/crud';
import { FoldersSchema, FoldersModel } from './folders.model';
import { UploadsHelper } from '../uploads.helper';
import sharedFolderService from '../shared-folder/shared-folder.service';

export class FoldersService extends CrudService<FoldersSchema> {

    constructor() {
        super(new Repo(FoldersModel), {
            unique: ['name'],
            create: {
                post(folder) {
                    UploadsHelper.createFolderDirectory(folder.id);
                }
            },
            update: {
                async pre(folder) {
                    const sharedFolder = await sharedFolderService.one({ folder: folder.id });
                    if (sharedFolder.data.shared) {
                        throw new Error('Shared folder cannot updated');
                    }
                },
            },
            delete: {
                async pre(folder) {
                    const sharedFolder = await sharedFolderService.one({ folder: folder.id });
                    if (sharedFolder.data.shared) {
                        throw new Error('Shared folder cannot deleted');
                    }
                },
                post(folder) {
                    UploadsHelper.removeFolder(folder.id);
                }
            }
        });
    }
}

export default new FoldersService();
