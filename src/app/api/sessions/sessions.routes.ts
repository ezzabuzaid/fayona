import { SessionSchema } from './sessions.model';
import { Request } from 'express';
import { HttpGet, Route, HttpPatch } from '@lib/restful';
import { Constants } from '@core/constants';
import { CrudRouter } from '../../shared/crud';
import { SessionsService } from './sessions.service';
import { IsMongoId } from 'class-validator';
import { cast } from '@core/utils';
import { ForeignKey, PrimaryKey } from '@lib/mongoose';
import { identity, tokenService } from '@shared/identity';
import { Responses } from '@core/response';
import { validate } from '@lib/validation';
import { locate } from '@lib/locator';

export class DeactivateSessionPayload {

    @IsMongoId({ message: 'user must be string' })
    public user: ForeignKey = null;

    @IsMongoId({ message: 'session_id must be string' })
    public session_id: PrimaryKey = null;

}

@Route(Constants.Endpoints.SESSIONS, {
    middleware: [identity.isAuthenticated()]
})
export class SessionRouter extends CrudRouter<SessionSchema, SessionsService> {
    constructor() {
        super(locate(SessionsService));
    }

    @HttpGet(Constants.Endpoints.USERS_SESSIONS)
    public async getUserSessions(req: Request) {
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const records = await this.service.all({ user: decodedToken.id });
        return new Responses.Ok(records.data);
    }

    @HttpPatch('deactivate', validate(DeactivateSessionPayload))
    public async deActivateSession(req: Request) {
        const { session_id: _id, user } = cast<DeactivateSessionPayload>(req.body);
        const result = await this.service.deActivate({ _id, user });
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        } else {
            return new Responses.Ok(result.data);
        }
    }

}
