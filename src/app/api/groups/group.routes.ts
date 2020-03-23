import { Router, Post, Get, Intercept } from '@lib/methods';
import { Constants, tokenService, Responses, sendResponse } from '@core/helpers';
import { CrudRouter } from '@shared/crud';
import { GroupsSchema, GroupMemberSchema } from './group.model';
import { groupsService, groupMemebrsService } from './group.service';
import { Request, Response, NextFunction, } from 'express';
import { Auth } from '@api/portal';
import { AppUtils } from '@core/utils';
import { IsArray, IsString } from 'class-validator';

class GroupPayload {
    @IsArray() public members: string[] = null;
    constructor(payload: GroupPayload) {
        AppUtils.strictAssign(this, payload);
    }
}

@Router(Constants.Endpoints.GROUPS, {
    middleware: [Auth.isAuthenticated]
})
export class GroupsRouter extends CrudRouter<GroupsSchema> {
    constructor() {
        super(groupsService);
    }

    @Intercept()
    public async interceptRequests(req: Request, res: Response, next: NextFunction) {
        console.log('originalUrl => ', req.originalUrl);
        console.log('url => ', req.url);
        console.log('baseUrl => ', req.baseUrl);
        next();
    }

    @Post('/')
    public async create(req: Request, res: Response) {
        // TODO: create member and group should be within transaction
        const { members } = new GroupPayload(req.body);
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        if (AppUtils.isFalsy(AppUtils.hasItemWithin(members))) {
            throw new Responses.BadRequest('a group should consist of more than one member');
        }

        const group = await this.service.create({});
        if (group.hasError) {
            throw new Responses.BadRequest(group.data);
        }

        await groupMemebrsService.create({
            group: group.data.id,
            user: decodedToken.id,
            isAdmin: true
        });

        // FIXME this will do several round trip to database server
        for (const member_id of members) {
            await groupMemebrsService.create({
                group: group.data.id,
                user: member_id,
                isAdmin: false
            });
        }
        sendResponse(res, new Responses.Created(group.data));
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
        const members = await this.service.all({ group: group_id }, { group: 0 });
        const response = new Responses.Ok(members);
        response.count = members.length;
        sendResponse(res, response);
    }

}
