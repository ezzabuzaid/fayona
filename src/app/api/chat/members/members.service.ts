import { CrudService, Repo } from '@shared/crud';
import membersModel, { GroupMemberSchema } from './members.model';

export class GroupMembersService extends CrudService<GroupMemberSchema> {
    constructor() {
        super(new Repo(membersModel), {
            all: {
                async pre(documents) {
                    documents.populate('user');
                }
            },
        });
    }

    getMemberGroups(id: string) {
        return this.repo.fetchAll({ user: id }, {}, {
            populate: 'group'
        });
    }

    getGroup(ids: string[]) {
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
