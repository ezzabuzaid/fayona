import { CrudService, Repo } from '@shared/crud';
import { UploadsSchema, UploadsModel } from './uploads.model';
import { CastObjectIDToString } from '@lib/mongoose';
import { AppUtils } from '@core/utils';

export class UploadsService extends CrudService<UploadsSchema> {
    constructor() {
        super(new Repo(UploadsModel));
    }

    public searchForFiles(query: Partial<CastObjectIDToString<UploadsSchema>>) {
        const extendedQuery = {
            folder: query.folder || undefined,
            user: query.user,
            name: AppUtils.isEmptyString(query.name)
                ? undefined
                : {
                    $regex: query.name,
                    $options: 'i'
                }
        };
        return this.repo.fetchAll()
            .merge(AppUtils.excludeEmptyKeys(extendedQuery))
            .exec();
    }
}

export default new UploadsService();
