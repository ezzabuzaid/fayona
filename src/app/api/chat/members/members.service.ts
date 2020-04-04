import { CrudService, Repo } from '@shared/crud';
import membersModel, { GroupMemberSchema } from './members.model';
import sharedFolder from '@api/uploads/shared-folder/shared-folder.service';
import { GroupsSchema } from '../groups';
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
                        folder: (populatedMember.group as unknown as GroupsSchema).folder,
                        shared: true,
                        user: member.user as any
                    });
                }
            }
        });
    }

    getMemberGroups(id: PrimaryID) {
        return this.repo.fetchAll({ user: id }, {
            populate: 'group'
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
                    const sameMembers = group.members.every((element) => ids.includes(element));
                    return sameMembers ? group : null;
                });
            });
    }
}

export default new GroupMembersService();
