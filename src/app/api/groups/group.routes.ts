import { Router, Post, Get } from '@lib/methods';
import { Constants, tokenService, Responses, sendResponse } from '@core/helpers';
import { CrudRouter } from '@shared/crud';
import { GroupsSchema, GroupMemberSchema } from './group.model';
import { groupsService, groupMemebrsService } from './group.service';
import { Request, Response, } from 'express';
import { Auth } from '@api/portal';
import { IGroupsDto } from './groups.dto';

@Router(Constants.Endpoints.GROUPS)
export class GroupsRouter extends CrudRouter<GroupsSchema> {
    constructor() {
        super(groupsService);
    }

    @Post('/', Auth.isAuthenticated)
    public async create(req: Request, res: Response) {
        // TODO: create member and group should be within transaction
        const { logo, title, members } = req.body as IGroupsDto;
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const createGroupResult = await this.service.create(req.body);
        if (createGroupResult.hasError) {
            throw new Responses.BadRequest(createGroupResult.data);
        }

        const createMemeberResult = await groupMemebrsService.create({
            group_id: createGroupResult.data.id,
            user_id: decodedToken.id,
            isAdmin: true
        });
        if (createMemeberResult.hasError) {
            throw new Responses.BadRequest(createMemeberResult.data);
        }
        sendResponse(res, new Responses.Created(createGroupResult.data));
    }

}

@Router(Constants.Endpoints.MEMBERS)
export class MembersRouter extends CrudRouter<GroupMemberSchema> {
    constructor() {
        super(groupMemebrsService);
    }

    @Get('/groups/:group_id', Auth.isAuthenticated)
    public async getMembersByGroupId(req: Request, res: Response) {
        const { group_id } = req.params;
        const records = await this.service.all({ group_id }, { group_id: 0 });
        const response = new Responses.Ok(records);
        response.count = records.length;
        sendResponse(res, response);
    }
}
