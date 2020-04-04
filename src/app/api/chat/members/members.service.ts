import { CrudService, Repo } from '@shared/crud';
import membersModel, { GroupMemberSchema } from './members.model';
import sharedFolder from '@api/uploads/shared-folder/shared-folder.service';
import { RoomSchema } from '../groups';
import { PrimaryID } from '@lib/mongoose';

export class GroupMembersService extends CrudService<GroupMemberSchema> {
    constructor() {
        super(new Repo(membersModel), {
            all: {
                async pre(documents) {
                    documents.populate('user');
                }
            },
            create: {
                async post(member) {
                    const populatedMember = await member.populate('group').execPopulate();
                    await sharedFolder.create({
                        folder: (populatedMember.room as unknown as RoomSchema).folder,
                        shared: true,
                        user: member.user as any
                    });
                }
            }
        });
    }

    getMemberGroups(id: PrimaryID) {
        return this.repo.fetchAll({ user: id }, {
            populate: 'room'
        });
    }

    getGroup(ids: PrimaryID[]) {
        return this.repo.model.aggregate([
            {
                $group: {
                    _id: '$group',
                    members: {
                        $push: {
                            $toString: '$user',
                        }
                    },

                },
            }])
            .exec()
            .then((groups) => {
                return groups.find((group) => {
                    // TODO: check if there's a way to this check using mongo aggregate
                    return ids.every((element) => group.members.includes(element));
                }) || null;
            });
    }
}

export default new GroupMembersService();
