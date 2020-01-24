import { sessionsService, SessionService } from './sessions.service';
import { CrudRouter } from '@shared/crud/crud.router';
import { SessionSchema } from './sessions.model';
import { Response, Request } from 'express';
import { Auth } from '@api/portal';
import { Get, Router, Patch } from '@lib/methods';
import { tokenService, SuccessResponse, Constants } from '@core/helpers';

@Router(Constants.Endpoints.SESSIONS)
export class SessionRouter extends CrudRouter<SessionSchema, SessionService> {
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

    @Patch('deactivate/:user_id', Auth.isAuthenticated)
    public async deActivateUserSessions(req: Request, res: Response) {
        const { user_id } = req.params;
        await this.service.deActivatedUserSessions(user_id);
        const response = new SuccessResponse(null);
        return res.status(response.code).json(response);
    }

    @Patch('deactivate/:id', Auth.isAuthenticated)
    public async deActivateSession(req: Request, res: Response) {
        const { id } = req.params;

        await this.service.deActivate({ id });

        const response = new SuccessResponse(null);
        return res.status(response.code).json(response);
    }

}
