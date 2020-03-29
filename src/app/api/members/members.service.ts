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
        // this.getGroup().then((x) => console.log('Count', x));
    }

    getGroup() {
        const ids = [
            '5e7931ea2dd4a528921dab78',
            '5e7bdd0392a3680b5755a39a'
        ];

        return this.repo.model
            .find()
            // .count({
            //     user:
            // })
            .or(ids.map((id) => ({ user: id })))
            // .aggregate([
            //     {
            //         $group: ""
            //     }
            // ])
            .exec();
    }
}

export default new GroupMembersService();

const x = [
    {
        name: 'test',
        g: 'group_1'
    },
    {
        name: 'test',
        g: 'group_w'
    },
    {
        name: 'admin',
        g: 'group_1'
    },
    {
        name: 'test',
        g: 'group_3'
    },
    {
        name: 'admin',
        g: 'group_3'
    }
];
