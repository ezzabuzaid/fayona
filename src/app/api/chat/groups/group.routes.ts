import { Router, Post, Intercept, Get } from '@lib/methods';
import { Constants, tokenService, Responses } from '@core/helpers';
import { CrudRouter } from '@shared/crud';
import { GroupsSchema } from './group.model';
import { groupsService, GroupService } from './group.service';
import { Request, response } from 'express';
import { Auth } from '@api/portal';
import { ArrayNotEmpty, IsString } from 'class-validator';
import { cast } from '@core/utils';
import { validate } from '@shared/common';
import messagesService from '@api/chat/messages/messages.service';
import membersService from '@api/chat/members/members.service';

class GroupPayload {
    @ArrayNotEmpty({
        message: 'a group should consist of more than one member'
    }) public members: string[] = null;
    @IsString() message: string = null;
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

    @Get('members', validate(SearchForGroupByMemberValidator, 'queryPolluted'))
    async getGroupByMemebers(req: Request) {
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const { members } = cast<SearchForGroupByMemberValidator>(req['queryPolluted']);
        members.push(decodedToken.id);
        const group = await membersService.getGroup(members);
        return new Responses.Ok(group);
    }

    // @Get()
    // public getGroups() {
    //     const groups = this.service.all({});
    //     return new Responses.Ok();
    // }

    @Post('/', validate(GroupPayload))
    public async create(req: Request) {
        // TODO: create member and group should be within transaction
        const { members, message } = cast<GroupPayload>(req.body);
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);

        const group = await this.service.create({
            single: members.length > 1
        });
        if (group.hasError) {
            throw new Responses.BadRequest(group.data);
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

}
