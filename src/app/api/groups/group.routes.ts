import { Router, Post, Get } from '@lib/methods';
import { Constants, tokenService, Responses, sendResponse } from '@core/helpers';
import { CrudRouter } from '@shared/crud';
import { GroupsSchema, GroupMemberSchema } from './group.model';
import { groupsService, groupMemebrsService } from './group.service';
import { Request, Response, } from 'express';
import { Auth } from '@api/portal';
import { IGroupsDto } from './groups.dto';
import { startSession } from 'mongoose';
import { AppUtils } from '@core/utils';

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

        if (AppUtils.isFalsy(AppUtils.hasItemWithin(members))) {
            throw new Responses.BadRequest('a group should consist of more than one member');
        }

        const createGroupResult = await this.service.create({ logo, title });
        if (createGroupResult.hasError) {
            throw new Responses.BadRequest(createGroupResult.data);
        }

        await groupMemebrsService.create({
            group_id: createGroupResult.data.id,
            user_id: decodedToken.id,
            isAdmin: true
        });

        for (const member_id of members) {
            await groupMemebrsService.create({
                group_id: createGroupResult.data.id,
                user_id: member_id,
                isAdmin: false
            });
        }
        sendResponse(res, new Responses.Created(createGroupResult.data.id));
    }

    @Post('setAdmin')
    public setMemberAsAdmin() {

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
