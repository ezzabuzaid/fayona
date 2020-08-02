import { CrudService, Repo, IReadAllOptions, Query } from '@shared/crud';
import { UploadsSchema } from './uploads.model';
import { AppUtils } from '@core/utils';
import { Singelton } from '@lib/locator';

@Singelton()
export class UploadsService extends CrudService<UploadsSchema> {
    constructor() {
        super(new Repo(UploadsSchema));
    }

    public searchForFiles(query: Query<UploadsSchema>, options: IReadAllOptions<UploadsSchema>) {
        const extendedQuery = {
            folder: query.folder || undefined,
            user: query.user,
            tag: query.tag,
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
