import { Router } from '@lib/methods';
import { Constants } from '@core/helpers';
import { CrudRouter, CrudService, Repo } from '@shared/crud';
import groupModel, { GroupsSchema } from './group.model';

@Router(Constants.Endpoints.GROUPS)
export class GroupsRouter extends CrudRouter<GroupsSchema> {
    constructor() {
        super(new CrudService(new Repo(groupModel)));
    }
}
