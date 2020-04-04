import { CrudService, Repo } from '@shared/crud';
import groupModel, { RoomSchema } from './group.model';
import foldersService from '@api/uploads/folders/folders.service';

export class GroupService extends CrudService<RoomSchema> {
    // TODO: you can easily move the creation logic from the group router to be used here
    // in create post hook, but the problem that we need to pass the user id from the token
    constructor() {
        super(new Repo(groupModel), {
            create: {
                async post(group) {
                    const folder = await foldersService.create({ name: group.name });
                    group.folder = folder.data.id;
                },
                result: (group) => group
            },
        });
    }
}

export const groupsService = new GroupService();
