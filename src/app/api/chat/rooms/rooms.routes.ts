import { Route, Post, HttpGet } from '@lib/restful';
import { Constants } from '@core/helpers';
import { CrudRouter, Pagination } from '@shared/crud';
import { RoomSchema } from './rooms.model';
import roomsService, { RoomsService } from './rooms.service';
import { Request } from 'express';
import { ArrayNotEmpty, IsString, ArrayMinSize, IsNotEmpty, IsOptional } from 'class-validator';
import { cast } from '@core/utils';
import { validate, isValidId } from '@shared/common';
import messagesService from '@api/chat/messages/messages.service';
import membersService from '@api/chat/members/members.service';
import { PrimaryKey } from '@lib/mongoose';
import { identity, tokenService } from '@shared/identity';
import { Responses } from '@core/response';

class RoomPayload {
    @ArrayMinSize(1, { message: 'a room should at least contain two member' }) public members: PrimaryKey[] = null;
    @IsNotEmpty() message: string = null;
    // @IsOptional()
    @IsString()
    name: string = null;
}

class SearchForRoomByMemberValidator {
    @ArrayNotEmpty({
        message: 'a room should consist of more than one member'
    }) public members: PrimaryKey[] = null;
}

@Route(Constants.Endpoints.ROOMS, {
    middleware: [identity.isAuthenticated()]
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
            return new Responses.BadRequest(room.message);
        }

        await messagesService.create({
            text: message,
            user: decodedToken.id,
            room: room.data.id,
            order: 0,
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

    @HttpGet('members', validate(SearchForRoomByMemberValidator, 'queryPolluted'))
    async getRoomByMemebers(req: Request) {
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const { members } = cast<SearchForRoomByMemberValidator>(req['queryPolluted']);
        members.push(decodedToken.id);
        const room = await membersService.getRoom(members);
        return new Responses.Ok(room);
    }

    @HttpGet(':id/members', isValidId())
    public async getRoomMembers(req: Request) {
        const { id } = cast<{ id: PrimaryKey }>(req.params);
        const result = await membersService.all({ room: id }, {
            projection: {
                room: 0
            }
        });
        return new Responses.Ok(result.data);
    }

    @HttpGet('groups')
    public async getGroups(req: Request) {
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const groups = await membersService.getMemberRooms(decodedToken.id, false);
        return groups;
    }

    @HttpGet('conversations')
    public async getConversations(req: Request) {
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const conversations = await membersService.getMemberRooms(decodedToken.id, true);
        return conversations;
    }

    @HttpGet(':id/messages', isValidId(), validate(Pagination, 'query'))
    async getConversationMessages(req: Request) {
        const { id } = cast<{ id: PrimaryKey }>(req.params);
        const options = cast<Pagination>(req.query);
        const result = await messagesService.getLastMessage(id, options);
        return new Responses.Ok(result.data);
    }

}
