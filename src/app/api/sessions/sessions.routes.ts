import { SessionSchema } from './sessions.model';
import { Request } from 'express';
import { HttpGet, Route, HttpPatch, FromBody } from '@lib/restful';
import { Constants } from '@core/constants';
import { CrudRouter } from '../../shared/crud';
import { SessionsService } from './sessions.service';
import { IsMongoId } from 'class-validator';
import { ForeignKey, PrimaryKey } from '@lib/mongoose';
import { identity, tokenService } from '@shared/identity';
import { Responses } from '@core/response';
import { FromHeaders } from '@lib/restful/headers.decorator';

export class DeactivateSessionDto {
    @IsMongoId({ message: 'user must be string' })
    public user: ForeignKey = null;

    @IsMongoId({ message: 'session_id must be string' })
    public session_id: PrimaryKey = null;

}

@Route(Constants.Endpoints.SESSIONS, {
    middleware: [identity.Authorize()]
})
export class SessionRouter extends CrudRouter<SessionSchema, SessionsService> {
    constructor() {
        super(SessionsService);
    }

    @HttpGet(Constants.Endpoints.USERS_SESSIONS)
    public async getUserSessions(@FromHeaders('authorization') authorization: string) {
        const decodedToken = await tokenService.decodeToken(authorization);
        const records = await this.service.all({ user: decodedToken.id });
        return new Responses.Ok(records.data);
    }

    @HttpPatch('deactivate')
    public async deActivateSession(@FromBody(DeactivateSessionDto) body: DeactivateSessionDto) {
        const result = await this.service.deActivate({ _id: body.session_id, user: body.user });
        return new Responses.Ok(result.data);
    }

}
