import { CrudService } from '@shared/crud';
import sharedFolderModel, { SharedFolderSchema } from './shared-folder.model';
import { Constants } from '@core/helpers';

export class SharedFolderService extends CrudService<SharedFolderSchema> {
    constructor() {
        super(sharedFolderModel,
            {
                all: {
                    pre: (docs) => {
                        docs.select('folder').populate('folder');
                    },
                    post(docs) {

                    }
                }
            });
    }

    get() {
        return this.repo.model.aggregate([])
            .lookup({
                from: Constants.Schemas.FOLDERS,
                localField: 'folder',
                foreignField: '_id',
                as: 'folder'
            })
            .replaceRoot({ $mergeObjects: ['$$ROOT'] })
            .exec(console.log);
    }
}

export default new SharedFolderService();
