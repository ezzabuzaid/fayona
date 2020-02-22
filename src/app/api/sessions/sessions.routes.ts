import { SessionSchema, IDeactivateSessionPayload } from './sessions.model';
import { Response, Request } from 'express';
import { Auth } from '../portal/auth';
import { Get, Router, Patch } from '@lib/methods';
import { tokenService, Constants, sendResponse, Responses } from '@core/helpers';
import { CrudRouter } from '../../shared/crud';
import { sessionsService, SessionsService } from './sessions.service';
import { validatePayload } from '@shared/common';

@Router(Constants.Endpoints.SESSIONS)
export class SessionRouter extends CrudRouter<SessionSchema, SessionsService> {
    constructor() {
        super(sessionsService);
    }

    @Get(Constants.Endpoints.USER_SESSIONS, Auth.isAuthenticated)
    public async getUserSessions(req: Request, res: Response) {
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const records = await this.service.all({ user_id: decodedToken.id });
        sendResponse(res, new Responses.Ok(records));
    }

    @Patch('deactivate', Auth.isAuthenticated)
    public async deActivateSession(req: Request<any>, res: Response) {
        const payload = new IDeactivateSessionPayload(req.body);

        await validatePayload(payload);

        const result = await this.service.deActivate({
            _id: payload.session_id,
            user_id: payload.user_id
        });
        if (result.hasError) {
            sendResponse(res, new Responses.BadRequest(result.data));
        } else {
            sendResponse(res, new Responses.Ok(result.data));
        }
    }

}
