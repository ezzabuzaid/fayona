import { Router, Post, Get } from '@lib/methods';
import { Constants, tokenService, Responses } from '@core/helpers';
import { CrudRouter } from '@shared/crud';
import { RoomSchema } from './rooms.model';
import roomsService, { RoomsService } from './rooms.service';
import { Request } from 'express';
import { Auth } from '@api/portal';
import { ArrayNotEmpty, IsString, ArrayMinSize } from 'class-validator';
import { cast } from '@core/utils';
import { validate, isValidId } from '@shared/common';
import messagesService from '@api/chat/messages/messages.service';
import membersService from '@api/chat/members/members.service';
import { PrimaryKey } from '@lib/mongoose';

class RoomPayload {
    @ArrayMinSize(1, { message: 'a room should at least contain two member' }) public members: PrimaryKey[] = null;
    @IsString() message: string = null;
    @IsString() name: string = null;
}

class SearchForRoomByMemberValidator {
    @ArrayNotEmpty({
        message: 'a room should consist of more than one member'
    }) public members: PrimaryKey[] = null;
}

@Router(Constants.Endpoints.ROOMS, {
    middleware: [Auth.isAuthenticated]
})
export class RoomsRouter extends CrudRouter<RoomSchema, RoomsService> {
    constructor() {
        super(roomsService);
    }

    @Post('/', validate(RoomPayload))
    public async create(req: Request) {
        // TODO: create member and group should be within transaction
        const { members, message, name } = cast<RoomPayload>(req.body);
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const room = await this.service.create({
            single: members.length === 1,
            name
        });

        if (room.hasError) {
            throw new Responses.BadRequest(room.message);
        }

        await messagesService.create({
            text: message,
            user: decodedToken.id,
            room: room.data.id
        });

        await membersService.create({
            room: room.data.id,
            // TODO: find a way to pass the token to service so you don't need this method here,
            // you can move it to service
            user: decodedToken.id,
            isAdmin: true
        });
        // FIXME this will do several round trip to database server
        for (const member_id of members) {
            await membersService.create({
                room: room.data.id,
                user: member_id,
                isAdmin: false
            });
        }
        return new Responses.Created(room.data);
    }

    @Get('members', validate(SearchForRoomByMemberValidator, 'queryPolluted'))
    async getRoomByMemebers(req: Request) {
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const { members } = cast<SearchForRoomByMemberValidator>(req['queryPolluted']);
        members.push(decodedToken.id);
        const room = await membersService.getRoom(members);
        return new Responses.Ok(room);
    }

    @Get('member/:id', isValidId())
    async getRoom(req: Request) {
        const { id } = cast<{ id: PrimaryKey }>(req.params);
        return membersService.getMemberRooms(id);
    }

    @Get(':id/members', isValidId())
    public async getMembersByRoomId(req: Request) {
        const { id } = cast<{ id: PrimaryKey }>(req.params);
        const result = await membersService.all({ room: id }, {
            projection: {
                room: 0
            }
        });
        return new Responses.Ok(result.data);
    }

    @Get('groups')
    public async getGroups(req: Request) {
        const groups = await this.service.all({
            single: false,
        });
        return groups.data;
    }

    @Get('conversations')
    public async getConversations(req: Request) {
        const conversations = await this.service.all({
            single: true,
        });
        return conversations.data;
    }

    @Get(':id/messages', isValidId())
    async getConversationMessages(req: Request) {
        const { id } = cast<{ id: PrimaryKey }>(req.params);
        const result = await messagesService.all({ room: id });
        return new Responses.Ok(result.data);
    }

}
