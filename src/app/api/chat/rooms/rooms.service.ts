import { CrudService, Repo } from '@shared/crud';
import roomsModel, { RoomSchema } from './rooms.model';
import foldersService from '@api/uploads/folders/folders.service';

export class RoomsService extends CrudService<RoomSchema> {
    // TODO: you can easily move the creation logic from the room router to be used here
    // in create post hook, but the problem that we need to pass the user id from the token
    constructor() {
        super(new Repo(roomsModel), {
            create: {
                async post(room) {
                    const folder = await foldersService.create({ name: room.name });
                    room.folder = folder.data.id;
                },
                result: (room) => room
            },
        });
    }
}

export default new RoomsService();
