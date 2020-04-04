import { CrudService, Repo } from '@shared/crud';
import membersModel, { RoomMemberSchema } from './members.model';
import sharedFolder from '@api/uploads/shared-folder/shared-folder.service';
import { PrimaryID } from '@lib/mongoose';
import { RoomSchema } from '../rooms';
import { Constants } from '@core/helpers';

export class RoomMembersService extends CrudService<RoomMemberSchema> {
    constructor() {
        super(new Repo(membersModel), {
            all: {
                async pre(documents) {
                    documents.populate('user');
                }
            },
            create: {
                async post(member) {
                    const populatedMember = await member.populate('room').execPopulate();
                    await sharedFolder.create({
                        folder: (populatedMember.room as unknown as RoomSchema).folder,
                        shared: true,
                        user: member.user as any
                    });
                }
            }
        });
    }

    getMemberRooms(id: PrimaryID) {
        return this.repo.fetchAll({ user: id }, {
            populate: 'room'
        });
    }

    getRoom(ids: PrimaryID[]) {
        return this.repo.model.aggregate([
            {
                $group: {
                    _id: '$room',
                    members: {
                        $push: {
                            $toString: '$user',
                        }
                    },

                },
            }])
            .exec()
            .then((rooms) => {
                return rooms.find((room) => {
                    // TODO: check if there's a way to this check using mongo aggregate
                    return ids.every((element) => room.members.includes(element));
                }) || null;
            });
    }
}

export default new RoomMembersService();
