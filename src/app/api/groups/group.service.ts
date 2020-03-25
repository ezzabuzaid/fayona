import { CrudService, Repo } from '@shared/crud';
import { groupModel, GroupsSchema, groupMemberModel, GroupMemberSchema } from './group.model';
import { Constants } from '@core/helpers';
import foldersService from '@api/uploads/folders.service';

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
            all: {
                async pre(documents) {
                    documents.populate('user');
                }
            },
            create: {
                // async pre(group) {
                //     const folder = await foldersService.create({
                //         name: group.id,
                // FIXME there's no posiblity to assign the folder here because we need
                // the folder to be shared across the groups member
                //         // user: conversation.user1 as any
                //     });
                //     group.folder = folder.data.id;
                // }
            }
        });
    }

}

export const groupsService = new GroupService();
export const groupMemebrsService = new GroupMembersService();
