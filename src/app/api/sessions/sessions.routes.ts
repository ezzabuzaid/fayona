import { SessionSchema } from './sessions.model';
import { Response, Request } from 'express';
import { Auth } from '../portal/auth';
import { Get, Router, Patch } from '@lib/methods';
import { tokenService, Constants, sendResponse, Responses } from '@core/helpers';
import { CrudRouter } from '../../shared/crud';
import { sessionsService, SessionsService } from './sessions.service';
import { validate, PayloadValidator } from '@shared/common';
import { IsMongoId } from 'class-validator';
import { cast } from '@core/utils';

class DeactivateSessionPayload extends PayloadValidator {

    @IsMongoId({ message: 'user must be string' })
    public user: string = null;

    @IsMongoId({ message: 'session_id must be string' })
    public session_id: string = null;

}

@Router(Constants.Endpoints.SESSIONS, {
    middleware: [Auth.isAuthenticated]
})
export class SessionRouter extends CrudRouter<SessionSchema, SessionsService> {
    constructor() {
        super(sessionsService);
    }

    @Get(Constants.Endpoints.USERS_SESSIONS)
    public async getUserSessions(req: Request, res: Response) {
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const records = await this.service.all({ user: decodedToken.id });
        sendResponse(res, new Responses.Ok(records));
    }

    @Patch('deactivate', validate(DeactivateSessionPayload))
    public async deActivateSession(req: Request<any>, res: Response) {
        const { session_id: _id, user } = cast<DeactivateSessionPayload>(req.body);
        const result = await this.service.deActivate({ _id, user });
        if (result.hasError) {
            sendResponse(res, new Responses.BadRequest(result.data));
        } else {
            sendResponse(res, new Responses.Ok(result.data));
        }
    }

}
