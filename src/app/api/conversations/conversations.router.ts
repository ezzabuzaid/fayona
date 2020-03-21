import { Router, Get } from '@lib/methods';
import { CrudRouter } from '@shared/crud';
import { Constants, tokenService, sendResponse, Responses } from '@core/helpers';
import conversationsService, { ConversationsService } from './conversations.service';
import { ConversationSchema } from './conversations.model';
import { Response, Request } from 'express';
import { Auth } from '@api/portal';
import messagesService from './messages.service';

@Router(Constants.Endpoints.Conversation, {
    middleware: [Auth.isAuthenticated]
})
export class ConversationRouter extends CrudRouter<ConversationSchema, ConversationsService> {
    constructor() {
        super(conversationsService);
    }

    @Get('user/:user')
    async getConversationByUsersKeys(req: Request, res: Response) {
        const { user } = req.params;
        const { id } = await tokenService.decodeToken(req.headers.authorization);
        const result = await this.service.getConversation(user, id);
        sendResponse(res, new Responses.Ok(result));
    }

    @Get('messages/:conversation')
    async getConversationMessages(req: Request, res: Response) {
        const { conversation } = req.params;
        const result = await messagesService.all({
            conversation
        });
        sendResponse(res, new Responses.Ok(result));
    }

}
