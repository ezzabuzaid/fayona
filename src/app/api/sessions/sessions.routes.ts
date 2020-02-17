import { SessionSchema } from './sessions.model';
import { Response, Request } from 'express';
import { Auth } from '../portal/auth';
import { Get, Router, Patch } from '@lib/methods';
import { tokenService, SuccessResponse, Constants, sendResponse, Responses } from '@core/helpers';
import { CrudRouter } from '../../shared/crud';
import { sessionsService, SessionsService } from './sessions.service';
import { IDeactivateSessionDto } from './session.model';

@Router(Constants.Endpoints.SESSIONS)
export class SessionRouter extends CrudRouter<SessionSchema, SessionsService> {
    constructor() {
        super(sessionsService);
    }

    @Get('user', Auth.isAuthenticated)
    public async getSessionsByUserId(req: Request, res: Response) {
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const records = await this.service.all({ user_id: decodedToken.id });

        const response = new SuccessResponse(records);
        return res.status(response.code).json(response);
    }

    @Patch('deactivate', Auth.isAuthenticated)
    public async deActivateSession(req: Request, res: Response) {
        const { session_id, user_id } = req.body as IDeactivateSessionDto;
        const result = await this.service.deActivate({ user_id, _id: session_id });
        if (result.hasError) {
            sendResponse(res, new Responses.BadRequest(result.data));
        } else {
            sendResponse(res, new Responses.Ok(result.data));
        }
    }

}
