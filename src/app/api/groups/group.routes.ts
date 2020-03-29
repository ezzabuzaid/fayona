import { Router, Post, Get, Intercept } from '@lib/methods';
import { Constants, tokenService, Responses } from '@core/helpers';
import { CrudRouter } from '@shared/crud';
import { GroupsSchema, GroupMemberSchema } from './group.model';
import { groupsService, groupMemebrsService } from './group.service';
import { Request, Response, NextFunction, } from 'express';
import { Auth } from '@api/portal';
import { ArrayNotEmpty, IsString } from 'class-validator';
import { cast } from '@core/utils';
import { validate } from '@shared/common';
import messagesService from '@api/conversations/messages.service';

class GroupPayload {
    @ArrayNotEmpty({
        message: 'a group should consist of more than one member'
    }) public members: string[] = null;
    @IsString() message: string = null;
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

    @Post('/', validate(GroupPayload))
    public async create(req: Request) {
        // TODO: create member and group should be within transaction
        const { members, message } = cast<GroupPayload>(req.body);
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);

        const group = await this.service.create({});
        if (group.hasError) {
            throw new Responses.BadRequest(group.data);
        }

        await messagesService.create({
            text: message,
            user: decodedToken.id,
            conversation: group.data.id
        });

        await groupMemebrsService.create({
            group: group.data.id,
            // TODO: find a way to pass the token to service so you don't need this method
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
        return new Responses.Created(group.data);
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
        const result = await this.service.all({ group: group_id }, { projection: { group: 0 } });
        return new Responses.Ok(result.data);
    }

}
