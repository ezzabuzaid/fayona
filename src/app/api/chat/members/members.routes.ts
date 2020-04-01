import { Constants, Responses } from '@core/helpers';
import { CrudRouter } from '@shared/crud';
import { Get, Router } from '@lib/methods';
import { Auth } from '@api/portal';
import { Request } from 'express';
import membersService from './members.service';
import { GroupMemberSchema } from './members.model';

@Router(Constants.Endpoints.MEMBERS)
export class MembersRouter extends CrudRouter<GroupMemberSchema> {
    constructor() {
        super(membersService);
    }

    @Get('/groups/:group_id', Auth.isAuthenticated)
    public async getMembersByGroupId(req: Request) {
        const { group_id } = req.params;
        const result = await this.service.all({ group: group_id }, { projection: { group: 0 } });
        return new Responses.Ok(result.data);
    }

}
