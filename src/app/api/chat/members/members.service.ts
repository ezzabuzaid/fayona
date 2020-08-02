import { CrudService, CrudDao } from '@shared/crud';
import { RoomMemberSchema } from './members.model';
import sharedFolder from '@api/uploads/shared-folder/shared-folder.service';
import { PrimaryKey } from '@lib/mongoose';
import { RoomSchema } from '../rooms';
import { AppUtils } from '@core/utils';

export class RoomMembersService extends CrudService<RoomMemberSchema> {
    constructor() {
        super(new CrudDao(RoomMemberSchema), {
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

    async getMemberRooms(id: PrimaryKey, single: boolean) {
        const result = await this.all({
            user: id
        }, {
            populate: {
                path: 'room',
                match: {
                    single,
                }
            },
            projection: {
                room: 1,
            }
        });
        return {
            ...result.data,
            list: result.data.list.map(({ room }) => room).filter(AppUtils.isTruthy)
        };
    }

    getRoom(ids: PrimaryKey[]) {
        return this.dao.model.aggregate([
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
