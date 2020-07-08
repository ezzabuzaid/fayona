import { CrudService, Repo } from '@shared/crud';
import { SharedFolderSchema } from './shared-folder.model';
import { Constants } from '@core/helpers';
import { PrimaryKey } from '@lib/mongoose';

export class SharedFolderService extends CrudService<SharedFolderSchema> {

    constructor() {
        super(new Repo(SharedFolderSchema));
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

    async getUserFolders(user: PrimaryKey, shared: boolean) {
        const result = await this.all({
            user,
            shared
        }, {
            populate: 'folder',
            projection: {
                folder: 1
            }
        });
        result.data.list = result.data.list.map(({ folder }) => folder) as any;
        return result;
    }
}

export default new SharedFolderService();
