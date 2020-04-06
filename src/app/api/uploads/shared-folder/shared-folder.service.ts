import { Repo, CrudService } from '@shared/crud';
import sharedFolderModel, { SharedFolderSchema } from './shared-folder.model';

export class SharedFolderService extends CrudService<SharedFolderSchema> {
    constructor() {
        super(sharedFolderModel,
            {
                all: {
                    pre(docs) {
                        docs
                            .select('folder')
                            .populate('folder')
                            .distinct('folder')
                            .lean()
                            .exec();
                    }
                }
            });
    }
}

export default new SharedFolderService();
