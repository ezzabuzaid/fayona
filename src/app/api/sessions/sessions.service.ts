import { Repo, CrudService } from '@shared/crud';
import { SessionSchema, SessionModel } from './sessions.model';
import { Document, Payload, WithMongoID } from '@lib/mongoose';
import { AppUtils, Omit } from '@core/utils';

export class SessionsService extends CrudService<SessionSchema> {

    public async deActivate(query: Partial<Omit<WithMongoID<Payload<SessionSchema>>, 'active'>>) {
        const record = await this.getActiveSession(query);
        if (AppUtils.isTruthy(record)) {
            await this.setAsDeactive(record);
            // TODO: use Result class instead
            return { hasError: false, data: 'Session deactivated' };
        }
        return { hasError: true, data: 'no session available' };
    }

    public getActiveSession(query: Partial<Payload<SessionSchema>>) {
        return this.one({
            ...query,
            active: true
        });
    }

    public getActiveUserSession(user_id: string) {
        return this.all({ user_id, active: true });
    }

    private setAsDeactive(record: Document<SessionSchema>) {
        return this.update(record, { active: false });
    }

    public async deActivatedUserSessions(user_id: string) {
        const records = await this.all({ user_id });
        return Promise.all(records.map((record) => this.setAsDeactive(record)));
    }

}

export const sessionsService = new SessionsService(new Repo<SessionSchema>(SessionModel));
