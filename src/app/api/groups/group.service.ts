import { CrudService, Repo } from '@shared/crud';
import groupModel, { GroupsSchema } from './group.model';

class GroupService extends CrudService<GroupsSchema> {

    constructor() {
        super(new Repo(groupModel));
    }
}

export default new GroupService();
