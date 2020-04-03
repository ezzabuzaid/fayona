import { Router, Get, Post } from '@lib/methods';
import { CrudRouter } from '@shared/crud';
import { Constants, tokenService, Responses } from '@core/helpers';
import conversationsService, { ConversationsService } from './conversations.service';
import { ConversationSchema } from './conversations.model';
import { Request } from 'express';
import { Auth } from '@api/portal';
import messagesService from '../messages/messages.service';
import { IsMongoId, IsString } from 'class-validator';
import { validate } from '@shared/common';
import { cast } from '@core/utils';

class ConversationPayload {
    @IsMongoId()
    user1: string = null;

    @IsMongoId()
    user2: string = null;

    @IsString()
    message: string = null;
}

@Router(Constants.Endpoints.CONVERSATIONS, {
    middleware: [Auth.isAuthenticated]
})
export class ConversationRouter extends CrudRouter<ConversationSchema, ConversationsService> {
    constructor() {
        super(conversationsService);
    }

    @Get()
    async getConversations(req: Request) {
        const { id } = await tokenService.decodeToken(req.headers.authorization);
        const result = await this.service.getConversations(id);
        return result;
    }

    @Get('user/:user')
    async getConversationByUsersKeys(req: Request) {
        const { user } = req.params;
        const { id } = await tokenService.decodeToken(req.headers.authorization);
        const result = await this.service.getConversation(user, id);
        return new Responses.Ok(result);
    }

    @Get('messages/:conversation')
    async getConversationMessages(req: Request) {
        const { conversation } = req.params;
        const result = await messagesService.all({
            conversation
        });
        return new Responses.Ok(result.data);
    }

    @Post('/', validate(ConversationPayload))
    async createConversation(req: Request) {
        const payload = cast<ConversationPayload>(req.body);
        const result = await conversationsService.create({
            user1: payload.user1,
            user2: payload.user2
        });
        if (result.hasError) {
            throw new Responses.BadRequest(result.data);
        }
        await messagesService.create({
            text: payload.message,
            user: payload.user1,
            conversation: result.data.id
        });
        return new Responses.Ok(result.data);
    }

}
