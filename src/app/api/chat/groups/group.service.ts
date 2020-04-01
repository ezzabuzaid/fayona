import { CrudService, Repo } from '@shared/crud';
import { groupModel, GroupsSchema } from './group.model';
import foldersService from '@api/uploads/folders.service';

export class GroupService extends CrudService<GroupsSchema> {
    // TODO: you can easily move the creation logic from the group router to be used here
    // in create post hook, but the problem that we need to pass the user id from the token
    constructor() {
        super(new Repo(groupModel), {
            create: {
                async pre(group) {
                    const folder = await foldersService.create({
                        name: group.id, // should be group id
                        // FIXME there's no posiblity to assign the folder here because we need
                        // the folder to be shared across the groups member
                        user: group.id
                    });
                    group.folder = folder.data.id;
                },
                result: (group) => group
            },
            all: {
                post(groups) {
                    groups.map((group) => {
                        if (group.single) {
                            group.title = '';
                        }
                    });
                }
            }
        });
    }
}

export const groupsService = new GroupService();
