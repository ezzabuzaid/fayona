import { Router, Post, Get } from '@lib/methods';
import { Constants, tokenService, Responses } from '@core/helpers';
import { CrudRouter } from '@shared/crud';
import { GroupsSchema } from './group.model';
import { groupsService, GroupService } from './group.service';
import { Request } from 'express';
import { Auth } from '@api/portal';
import { ArrayNotEmpty, IsString, ArrayMinSize } from 'class-validator';
import { cast } from '@core/utils';
import { validate, isValidId } from '@shared/common';
import messagesService from '@api/chat/messages/messages.service';
import membersService from '@api/chat/members/members.service';

class GroupPayload {
    @ArrayMinSize(1, { message: 'a group should at least contain two member' }) public members: string[] = null;
    @IsString() message: string = null;
    @IsString() name: string = null;
}

class SearchForGroupByMemberValidator {
    @ArrayNotEmpty({
        message: 'a group should consist of more than one member'
    }) public members: string[] = null;
}

@Router(Constants.Endpoints.GROUPS, {
    middleware: [Auth.isAuthenticated]
})
export class GroupsRouter extends CrudRouter<GroupsSchema, GroupService> {
    constructor() {
        super(groupsService);
    }

    @Post('/', validate(GroupPayload))
    public async create(req: Request) {
        // TODO: create member and group should be within transaction
        const { members, message, name } = cast<GroupPayload>(req.body);
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);

        const group = await this.service.create({
            single: members.length > 1,
            name
        });

        if (group.hasError) {
            throw new Responses.BadRequest(group.message);
        }

        await messagesService.create({
            text: message,
            user: decodedToken.id,
            conversation: group.data.id
        });

        await membersService.create({
            group: group.data.id,
            // TODO: find a way to pass the token to service so you don't need this method
            user: decodedToken.id,
            isAdmin: true
        });

        // FIXME this will do several round trip to database server
        for (const member_id of members) {
            await membersService.create({
                group: group.data.id,
                user: member_id,
                isAdmin: false
            });
        }
        return new Responses.Created(group.data);
    }

    @Get('members', validate(SearchForGroupByMemberValidator, 'queryPolluted'))
    async getGroupByMemebers(req: Request) {
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const { members } = cast<SearchForGroupByMemberValidator>(req['queryPolluted']);
        members.push(decodedToken.id);
        const group = await membersService.getGroup(members);
        return new Responses.Ok(group);
    }

    @Get('member/:id', isValidId())
    async getGroup(req: Request) {
        const { id } = req.params;
        return membersService.getMemberGroups(id);
    }

    @Get(':id/members', isValidId())
    public async getMembersByGroupId(req: Request) {
        const { group_id } = req.params;
        const result = await membersService.all({ group: group_id }, {
            projection: {
                group: 0
            }
        });
        return new Responses.Ok(result.data);
    }

}
