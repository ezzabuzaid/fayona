import { CrudService, Repo } from '@shared/crud';
import { groupModel, GroupsSchema, groupMemberModel, GroupMemberSchema } from './group.model';

export class GroupService extends CrudService<GroupsSchema> {
    // TODO: you can easily move the creation logic from the group router to be used here
    // in create post hook, but the problem that we need to pass the user id from the token
    constructor() {
        super(new Repo(groupModel));
    }
}

export class GroupMembersService extends CrudService<GroupMemberSchema> {
    constructor() {
        super(new Repo(groupMemberModel), {
            unique: ['user_id']
        });
    }
}

export const groupsService = new GroupService();
export const groupMemebrsService = new GroupMembersService();
