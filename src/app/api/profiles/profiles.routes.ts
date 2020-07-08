import { CrudRouter, CrudService, Repo } from '@shared/crud';
import { ProfilesSchema } from './profiles.model';
import { Constants } from '@core/helpers';
import { Router } from '@lib/restful';

@Router(Constants.Endpoints.PROFILES)
export class AccountsRouter extends CrudRouter<ProfilesSchema> {
    constructor() {
        super(new CrudService(new Repo(ProfilesSchema)));
    }
}
