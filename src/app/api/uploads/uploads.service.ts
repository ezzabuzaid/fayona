import { CrudService, Repo, IReadAllOptions, Query } from '@shared/crud';
import { UploadsSchema, UploadsModel } from './uploads.model';
import { AppUtils } from '@core/utils';

export class UploadsService extends CrudService<UploadsSchema> {
    constructor() {
        super(new Repo(UploadsModel));
    }

    public searchForFiles(query: Query<UploadsSchema>, options: IReadAllOptions<UploadsSchema>) {
        const extendedQuery = {
            folder: query.folder || undefined,
            user: query.user,
            name: AppUtils.isEmptyString(query.name as string)
                ? undefined
                : {
                    $regex: query.name,
                    $options: 'i'
                }
        };
        return this.all(AppUtils.excludeEmptyKeys(extendedQuery), options);
    }
}

export default new UploadsService();
